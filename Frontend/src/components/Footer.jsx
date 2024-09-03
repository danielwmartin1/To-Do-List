import React from "react";
import "../index.css";

function Footer() {
  // Get the current year
  const year = new Date().getFullYear();
  return (
    <React.StrictMode>
      <div className="footer">
        <hr />
        <footer>
          <p>Copyright ⓒ {year}</p>
        </footer>
      </div>
    </React.StrictMode>
  );
}

export default Footer;
