import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import 'react-app-polyfill/ie9';

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
