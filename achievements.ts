import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ArcadeProvider } from "./context/ArcadeContext";
import "./styles/global.css";
import "./styles/arcade.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

createRoot(rootEl).render(
  <StrictMode>
    <ArcadeProvider>
      <App />
    </ArcadeProvider>
  </StrictMode>
);
