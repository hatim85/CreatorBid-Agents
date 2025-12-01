import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import AgentCard from "./AgentCard";

export default function AgentsGallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [agents, setAgents] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [hasMore, setHasMore] = useState(true);

  const fetchAgents = useCallback(async (pageNum, searchQuery) => {
    setLoading(true);
    try {
      let url = `https://creator.bid/api/agents?limit=32&page=${pageNum}&sortDirection=desc&sortBy=marketCap`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      const rawAgents = data.agents || [];

      // Filter out agents with missing or invalid data
      const validAgents = rawAgents.filter(agent => {
        const hasName = agent.name && agent.name.trim().length > 0;
        const hasMarketCap = !isNaN(parseFloat(agent.marketCap)) && parseFloat(agent.marketCap) > 0;
        const hasVolume = !isNaN(parseFloat(agent.cumulativeETHVolume)) && parseFloat(agent.cumulativeETHVolume) > 0;

        return hasName && hasMarketCap && hasVolume;
      });

      // Fetch metadata for each agent to get descriptions
      const enrichedAgents = await Promise.all(
        validAgents.map(async (agent) => {
          try {
            const metaRes = await fetch(`https://creator.bid/api/agents/metadata?agentId=${agent._id}`);
            if (metaRes.ok) {
              const meta = await metaRes.json();
              return { ...agent, description: meta.description };
            }
          } catch (err) {
            console.error(`Failed to fetch metadata for ${agent.name}:`, err);
          }
          return agent;
        })
      );

      // Check if there are more pages using numTotalAgents
      const totalAgents = data.numTotalAgents || 0;

      if (pageNum === 1) {
        setAgents(enrichedAgents);
        setHasMore(enrichedAgents.length < totalAgents);
      } else {
        setAgents((prev) => {
          const newTotal = [...prev, ...enrichedAgents];
          setHasMore(newTotal.length < totalAgents);
          return newTotal;
        });
      }
    } catch (err) {
      console.error("Failed to fetch agents:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Removed dependency on agents to prevent infinite loop

  // Initial fetch and search effect
  useEffect(() => {
    setPage(1);
    fetchAgents(1, search);
  }, [search, fetchAgents]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAgents(nextPage, search);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "40px 20px",
      maxWidth: "1600px",
      margin: "0 auto",
      color: "#fff"
    }}>
      <div style={{
        marginBottom: "56px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "28px",
        width: "100%"
      }}>
        <h1 style={{
          fontSize: "3.8rem",
          margin: 0,
          fontWeight: "800",
          background: "linear-gradient(135deg, #ffffff 0%, #a5a5a5 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em"
        }}>
          CreatorBid Agents
        </h1>
        <p style={{
          fontSize: "1.15rem",
          color: "rgba(255,255,255,0.7)",
          maxWidth: "600px",
          lineHeight: "1.6",
          margin: 0
        }}>
          Discover and interact with the next generation of AI agents.
        </p>

        <div style={{ position: "relative", width: "100%", maxWidth: "600px", marginTop: "8px" }}>
          <input
            type="text"
            placeholder="Search agents..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              if (value) {
                setSearchParams({ search: value });
              } else {
                setSearchParams({});
              }
            }}
            style={{
              padding: "18px 28px",
              paddingLeft: "56px",
              fontSize: "1.05rem",
              borderRadius: "100px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "#fff",
              width: "100%",
              outline: "none",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 24px rgba(0,0,0,0.2)"
            }}
            onFocus={(e) => {
              e.target.style.background = "rgba(255,255,255,0.1)";
              e.target.style.borderColor = "rgba(255,255,255,0.3)";
              e.target.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
            }}
            onBlur={(e) => {
              e.target.style.background = "rgba(255,255,255,0.05)";
              e.target.style.borderColor = "rgba(255,255,255,0.15)";
              e.target.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.5 }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "32px",
          width: "100%",
        }}
      >
        {agents.map((agent) => (
          <AgentCard key={agent._id} agent={agent} searchQuery={search} />
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px", opacity: 0.7 }}>
          <div style={{ display: "inline-block", width: "24px", height: "24px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {!loading && hasMore && (
        <div style={{ textAlign: "center", marginTop: "60px" }}>
          <button
            onClick={handleLoadMore}
            style={{
              padding: "14px 40px",
              fontSize: "1rem",
              borderRadius: "100px",
              border: "none",
              background: "#fff",
              color: "#000",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 15px rgba(255,255,255,0.2)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(255,255,255,0.2)";
            }}
          >
            Load More Agents
          </button>
        </div>
      )}

      {!loading && !hasMore && agents.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px", opacity: 0.5, fontSize: "1.2rem" }}>
          No agents found matching your search.
        </div>
      )}
    </div>
  );
}
