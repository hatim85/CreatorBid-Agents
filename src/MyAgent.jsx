// AgentProfile.jsx
import React, { useEffect, useState } from "react";

// Replace with your actual agent ID from CreatorBid
const MY_AGENT_ID = "692ae9943e131028c344b312";

export default function AgentProfile() {
  const [agent, setAgent] = useState(null);
  const [price, setPrice] = useState(null);
  const [members, setMembers] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAgent() {
      try {
        // Fetch metadata
        const metaRes = await fetch(`https://creator.bid/api/agents/metadata?agentId=${MY_AGENT_ID}`);
        const metaJson = await metaRes.json();
        setAgent(metaJson);

        // Fetch price
        const priceRes = await fetch(`https://creator.bid/api/agents/price?agentId=${MY_AGENT_ID}`);
        const priceJson = await priceRes.json();
        setPrice(priceJson.price);

        // Fetch membership / members list (optional)
        const memRes = await fetch(`https://creator.bid/api/agents/${MY_AGENT_ID}/members`);
        const memJson = await memRes.json();
        setMembers(memJson.members);
      } catch (e) {
        console.error("Error fetching agent data", e);
        setError("Failed to load agent");
      }
    }

    fetchAgent();
  }, []);

  if (error) return <div>{error}</div>;
  if (!agent) return <div>Loading agent...</div>;

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px", border: "1px solid #ccc" }}>
      <h2>{agent.name}</h2>
      <img src={agent.profilePicture} alt={agent.name} style={{ width: "100%", borderRadius: "8px" }} />
      <p>{agent.description}</p>
      <p><strong>Price:</strong> {price} (native token)</p>

      {members && (
        <div>
          <h4>Members / Holders:</h4>
          <ul>
            {members.map((m) => (
              <li key={m.address}>
                {m.address} — locked: {m.amountLocked}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
