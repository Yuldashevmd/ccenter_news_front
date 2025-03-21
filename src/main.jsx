import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00235A",
          },
        }}
      >
        <App />
      </ConfigProvider>
  </BrowserRouter>
);
