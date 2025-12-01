import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

export default function AgentDetails() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [agent, setAgent] = useState(location.state?.agent || null);
    const [loading, setLoading] = useState(true);
    const searchQuery = location.state?.searchQuery || "";

    useEffect(() => {
        // Always fetch full metadata to ensure we get description
        async function fetchAgent() {
            try {
                const [metaRes, priceRes] = await Promise.all([
                    fetch(`https://creator.bid/api/agents/metadata?agentId=${id}`),
                    fetch(`https://creator.bid/api/agents/price?agentId=${id}`)
                ]);

                if (metaRes.ok) {
                    const meta = await metaRes.json();
                    let price = null;
                    if (priceRes.ok) {
                        const priceData = await priceRes.json();
                        price = priceData.priceNativeToken;
                    }

                    setAgent({
                        _id: id,
                        ...meta,
                        price
                    });
                }
            } catch (err) {
                console.error("Failed to fetch agent details:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAgent();
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#fff" }}>
                <div style={{ width: "30px", height: "30px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!agent) {
        return <div style={{ color: "#fff", textAlign: "center", marginTop: "100px" }}>Agent not found.</div>;
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "40px 20px",
            color: "#fff",
            fontFamily: "system-ui, sans-serif"
        }}>
            <div style={{ width: "100%", maxWidth: "1200px" }}>
                <button
                    onClick={() => navigate(searchQuery ? `/?search=${encodeURIComponent(searchQuery)}` : "/")}
                    style={{
                        background: "transparent",
                        border: "none",
                        color: "rgba(255,255,255,0.6)",
                        cursor: "pointer",
                        marginBottom: "32px",
                        fontSize: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "color 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "rgba(255,255,255,1)"}
                    onMouseLeave={(e) => e.target.style.color = "rgba(255,255,255,0.6)"}
                >
                    ← Back to Gallery
                </button>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "400px 1fr",
                    gap: "48px",
                    background: "rgba(255,255,255,0.03)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "24px",
                    padding: "48px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{
                            width: "100%",
                            paddingTop: "100%",
                            position: "relative",
                            borderRadius: "20px",
                            overflow: "hidden",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
                        }}>
                            <img
                                src={agent.profilePicture}
                                alt={agent.name}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }}
                            />
                        </div>

                        <a
                            href={`https://creator.bid/agents/${agent._id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                                background: "#fff",
                                color: "#000",
                                padding: "18px",
                                borderRadius: "12px",
                                fontWeight: "600",
                                textDecoration: "none",
                                transition: "transform 0.2s, box-shadow 0.2s",
                                textAlign: "center",
                                boxShadow: "0 4px 12px rgba(255,255,255,0.1)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,255,255,0.2)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,255,255,0.1)";
                            }}
                        >
                            View on CreatorBid
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                <h1 style={{ margin: 0, fontSize: "2.5rem", fontWeight: "700" }}>{agent.name}</h1>
                                {agent.symbol && (
                                    <span style={{
                                        background: "rgba(255,255,255,0.1)",
                                        padding: "4px 10px",
                                        borderRadius: "6px",
                                        fontSize: "0.9rem",
                                        fontWeight: "600",
                                        letterSpacing: "0.05em"
                                    }}>
                                        {agent.symbol}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "16px",
                            background: "rgba(0,0,0,0.2)",
                            padding: "20px",
                            borderRadius: "16px"
                        }}>
                            {agent.marketCap && !isNaN(parseFloat(agent.marketCap)) && parseFloat(agent.marketCap) > 0 && (
                                <div>
                                    <div style={{ fontSize: "0.9rem", opacity: 0.6, marginBottom: "4px" }}>Market Cap</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>${parseFloat(agent.marketCap).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                                </div>
                            )}
                            {agent.cumulativeETHVolume && !isNaN(parseFloat(agent.cumulativeETHVolume)) && parseFloat(agent.cumulativeETHVolume) > 0 && (
                                <div>
                                    <div style={{ fontSize: "0.9rem", opacity: 0.6, marginBottom: "4px" }}>Volume (ETH)</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{parseFloat(agent.cumulativeETHVolume).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                                </div>
                            )}
                            {agent.price && !isNaN(parseFloat(agent.price)) && (
                                <div>
                                    <div style={{ fontSize: "0.9rem", opacity: 0.6, marginBottom: "4px" }}>Price</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: "600" }}>{agent.price}</div>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 style={{ fontSize: "1.1rem", marginBottom: "12px", opacity: 0.9 }}>About</h3>
                            <p style={{
                                lineHeight: "1.7",
                                opacity: 0.8,
                                fontSize: "1.05rem",
                                whiteSpace: "pre-wrap"
                            }}>
                                {agent.description || "No description available for this agent."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
