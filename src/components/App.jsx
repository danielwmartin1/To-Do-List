import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import List from "./List";

function App() {
  return (
    <React.StrictMode>
    <div>
      <Header />
      <List />
      <Footer />
    </div>
    </React.StrictMode>
  );
}

export default App;