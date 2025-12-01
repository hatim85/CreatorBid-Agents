# CreatorBid Agent Gallery & Viewer 🎯

A fully frontend React application that displays AI Agents from the **CreatorBid Public API**. Users can explore a gallery of agents, view detailed metadata, and navigate between pages using a clean React Router setup.

This project uses **no backend, no blockchain code, and no paid features** — only CreatorBid’s free, public read-only APIs.

---

## 🚀 Features

* Display a gallery of CreatorBid agents using public API endpoints
* View agent details: image, description, symbol, price, market cap, volume
* Integrated pagination and search functionality
* Smooth UI with hover animations and responsive layout
* Direct link to view an agent on the CreatorBid official platform
* 100% frontend-only — no server or wallet required

---

## 📁 Project Structure

```
/               # project root
├── README.md
├── package.json
└── src/
    ├── App.jsx              # App router
    ├── AgentsGallery.jsx    # Gallery of all agents
    ├── AgentCard.jsx        # Individual card for each agent
    ├── AgentDetails.jsx     # Detailed page for selected agent
    └── index.css / assets   # Styles & assets (optional)
```

---

## 🧑‍💻 Getting Started

### Requirements

* Node.js v16+
* npm or yarn

### Install Dependencies

```
npm install
```

*or*

```
yarn install
```

### Run the Development Server

```
npm run dev
```

Your app will be available at:

```
http://localhost:3000
```

---

## 🔧 API Endpoints Used

This project uses **CreatorBid's Public APIs**:

### Fetch Agents List

```
GET https://creator.bid/api/agents?limit=32&page=<num>&sortDirection=desc&sortBy=marketCap
```

### Fetch Agent Metadata

```
GET https://creator.bid/api/agents/metadata?agentId=<AGENT_ID>
```

### Fetch Agent Price

```
GET https://creator.bid/api/agents/price?agentId=<AGENT_ID>
```

All endpoints are public and **require no API key**.

---

## ✨ How It Works

### AgentsGallery.jsx

* Fetches a list of agents with pagination
* Applies optional search
* Enriches each agent with full metadata
* Renders `AgentCard` components

### AgentCard.jsx

* Displays name, symbol, profile picture, market cap, volume
* Opens detailed view on click

### AgentDetails.jsx

* Fetches full metadata & price again for accuracy
* Displays image, stats, description
* Includes link to view agent on CreatorBid

### App.jsx

* Configures routes:

  * `/` → Gallery
  * `/agent/:id` → Agent Details

---

## 🔮 Future Enhancements

You may extend this project with:

* Wallet connection + check if user owns keys (using members API)
* Improved sorting and filtering
* Infinite scroll
* Dark mode / improved responsiveness
* (If CreatorBid exposes chat APIs) — custom agent chat UI

---

## 📝 License

This project is licensed under the **MIT License**. Feel free to use or modify in your own repos.

---

## 🙌 Motivation

This project is built to showcase how to integrate CreatorBid public APIs into a clean frontend interface — ideal for hackathons, demos, or creating community dashboards.
