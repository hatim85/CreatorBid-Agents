import { useNavigate } from "react-router-dom";

export default function AgentCard({ agent, searchQuery }) {
  const {
    _id,
    name,
    description,
    profilePicture,
    marketCap,
    cumulativeETHVolume,
    symbol,
  } = agent;

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/agent/${_id}`, { state: { agent, searchQuery } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="agent-card"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "16px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        overflow: "hidden",
        color: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 20px rgba(0, 0, 0, 0.2)";
        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.1)";
      }}
    >
      <div style={{ position: "relative", width: "100%", paddingTop: "100%", borderRadius: "12px", overflow: "hidden", background: "#000" }}>
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#333", color: "#666" }}>
            No Image
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</h3>
          {symbol && <span style={{ fontSize: "0.8rem", opacity: 0.7, background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{symbol}</span>}
        </div>

        <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.4" }}>
          {description || "No description available."}
        </p>
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.85rem", opacity: 0.9 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.6 }}>Market Cap</span>
          <span style={{ fontWeight: "500" }}>${parseFloat(marketCap).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ opacity: 0.6 }}>Vol (ETH)</span>
          <span style={{ fontWeight: "500" }}>{parseFloat(cumulativeETHVolume).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}
