import Footer from "@modules/layout/templates/footer";
import React from "react";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div>
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
