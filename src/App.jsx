import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AgentsGallery from "./AgentsGallery";
import AgentDetails from "./AgentDetails";

export default function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AgentsGallery />} />
          <Route path="/agent/:id" element={<AgentDetails />} />
        </Routes>
      </div>
    </Router>
  );
}