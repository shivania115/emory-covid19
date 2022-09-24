import "react-app-polyfill/ie9";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";
import { CookiesProvider } from "react-cookie";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
  rootElement
);
