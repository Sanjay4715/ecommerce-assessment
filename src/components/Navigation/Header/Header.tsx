"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Sun, User, User2Icon } from "lucide-react";

import Logo from "@/public/Logo.svg";
import { IoMdCart } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import CustomTooltip from "@/components/CustomTooltip/CustomTooltip";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import SearchProducts from "./SearchProducts";

const Header = () => {
  const { productCount, clearCart } = useCart();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userInitial, setUserInitial] = useState<string>("");

  useEffect(() => {
    setUserLoading(true);
    if (user) {
      setUserInitial(user.user.charAt(0).toUpperCase());
    } else {
      setUserInitial("");
    }
    setUserLoading(false);
  }, [user]);

  const handleLogout = () => {
    logout();
    clearCart();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-black bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pl-0 pr-0 sm:pl-20 sm:pr-20">
      <div className="flex w-full h-15 items-center">
        <Link href="/">
          <Image
            src={Logo}
            width={80}
            height={80}
            alt="Picture of the author"
            className="cursor-pointer flex-1"
          />
        </Link>

        <SearchProducts />

        <div className="flex items-center justify-center text-center ml-auto pl-1 pr-1 md:pl-3 md:pr-3">
          <CustomTooltip
            triggerContent={
              productCount > 0 ? (
                <div className="relative inline-block">
                  <IoMdCart
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => router.push("/cart")}
                  />
                  <Badge className="absolute -top-3 -right-4 text-xs px-1.5 py-0.5 rounded-full bg-[var(--site-primary)] text-white">
                    {productCount}
                  </Badge>
                </div>
              ) : (
                <div className="w-7 md:h-12 md:w-12 flex items-center justify-center">
                  <IoCartOutline
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => router.push("/cart")}
                  />
                </div>
              )
            }
            message={<p>Check your cart</p>}
          />
          <div
            onClick={toggleTheme}
            className="w-7 md:h-12 md:w-12 flex items-center justify-center"
          >
            {theme === "dark" ? (
              <CustomTooltip
                triggerContent={<Sun size={18} className="cursor-pointer" />}
                message={<p>Light Mode</p>}
              />
            ) : (
              <CustomTooltip
                triggerContent={<Moon size={18} className="cursor-pointer" />}
                message={<p>Dark Mode</p>}
              />
            )}
          </div>
          <div>
            {userLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : userInitial ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="flex items-center space-x-2">
                    <User2Icon />
                    <p>{user?.user}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  className="cursor-pointer hidden md:flex"
                  onClick={() => router.push("/login")}
                >
                  <User /> User Login
                </Button>
                <Button
                  className="cursor-pointer flex md:hidden"
                  onClick={() => router.push("/login")}
                >
                  <User /> Login
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
