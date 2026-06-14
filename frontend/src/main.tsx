// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./global.css";

import AuthProvider from "./context/AuthProvider";
import { SocketProvider } from "./context/SocketProvider";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SocketProvider>
      <App />
    </SocketProvider>
  </AuthProvider>,
);
