import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Footer from "./components/Footer";
import Header from "./components/Header";
// used concurrent mode with createRoot
const root = createRoot(document.getElementById("root"));
root.render(<App />, document.getElementById("root"));