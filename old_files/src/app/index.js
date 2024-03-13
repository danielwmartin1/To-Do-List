import React from "react";
import App from "./components/App";
// used concurrent mode with createRoot
const root = createRoot(document.getElementById("root"));
root.render(<React.StrictMode><App /></React.StrictMode>, document.getElementById("root"));