// import React from 'react'
import React from "react";

// import components
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

function LayOut({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default LayOut;
