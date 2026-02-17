"use client";
import React, { useEffect } from "react";

const Tawk = () => {
  useEffect(() => {
    // Dynamically inject the Tawk.to script
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script");
      var s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = 'https://embed.tawk.to/687b8683487057192063b18c/1j0h8at6r';
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  return (
    <div className="z-[100] bottom-7"
      title="Chat with us"
    >
      {/* Tawk.to chat widget will be injected here */}
    </div>
  );
};

export default Tawk;
