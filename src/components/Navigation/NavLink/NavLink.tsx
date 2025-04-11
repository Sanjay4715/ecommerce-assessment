"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  onClick?: () => void; // Optional onClick handler
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`hover:text-[var(--droomi-blue)] dark:hover:text-white
        ${
          isActive
            ? "font-bold text-[var(--droomi-blue)] dark:text-white text-md"
            : "font-medium text-black dark:text-gray-300 text-sm"
        }`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
