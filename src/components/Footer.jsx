import React from "react";

function Footer() {
  // Get the current year
  const year = new Date().getFullYear();
  return (
    <div>
      <hr />
      <footer>
        <p>Copyright ⓒ {year}</p>
      </footer>
    </div>
    
  );
}

export default Footer;
