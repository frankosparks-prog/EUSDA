import React from "react";

function FirstYearAdminLayout({ children }) {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      />
      <div
        className="p-6 max-w-6xl mx-auto"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {children}
      </div>
    </>
  );
}

export default FirstYearAdminLayout;
