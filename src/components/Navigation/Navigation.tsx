"use client";

import { ReactNode } from "react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-[70vh]">{children}</main>
      <Footer />
    </>
  );
};

export default Navigation;
