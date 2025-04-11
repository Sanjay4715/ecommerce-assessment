// context/AuthContext.tsx
"use client"; // Add this directive at the top

import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { JwtPayload } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface User extends JwtPayload {
  user: string;
}

type AuthContextType = {
  accessToken: string;
  user: User | null;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, userData: User) => {
    setAccessToken(token);
    setUser(userData);
    const encodedUserData = window.btoa(JSON.stringify(userData));
    setCookie("accessToken", token, {
      secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
      httpOnly: false, // Prevent client-side JavaScript from accessing the cookie
      sameSite: "strict", // Prevent cross-site request forgery
    });

    setCookie("user", encodedUserData, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: false, // Allow access to the user cookie for client-side
      sameSite: "strict",
    });
  };

  const logout = () => {
    setAccessToken("");
    setUser(null);
    deleteCookie("accessToken"); // delete acceessToken from a cookie
    deleteCookie("user"); // delete acceessToken from a cookie
    localStorage.setItem("cartProducts", "");
  };

  useEffect(() => {
    const storedUser = getCookie("user");

    if (storedUser && typeof storedUser === "string") {
      try {
        const decodedUser = window.atob(storedUser);
        setUser(JSON.parse(decodedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
