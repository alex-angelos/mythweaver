import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";

// ✅ Garante que só há UM root ativo
const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

let root = (container as any)._reactRootContainer;

// Se o root já existe, apenas renderiza novamente
if (!root) {
  root = ReactDOM.createRoot(container);
}

// 🚀 Render único e seguro
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
