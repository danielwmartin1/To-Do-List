import React from "react";

function Footer() {
  // Get the current year
  const year = new Date().getFullYear();
  return (
    <React.StrictMode>
      <div>
        <hr />
        <footer>
          <p>Copyright ⓒ {year}</p>
        </footer>
      </div>
    </React.StrictMode>
  );
}

export default Footer;
