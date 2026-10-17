"use client";
import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/legacy/image";
import { UserNav } from "../UserNav/UserNav";
import { IUserProfile } from "@/Types/UserProfile";
import { usePathname } from "next/navigation";

interface MenuItem {
  text: string;
  link: string;
}

function Nav({ userProfile }: { userProfile: IUserProfile }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [count, setCount] = useState<number>(0);
  const pathname = usePathname();

  const menuItems: MenuItem[] = [
    { text: "Home", link: "/" },
    { text: "Favorite", link: "/favorite" },
    { text: "Contact Us", link: "/contact-us" },
    { text: "About Us", link: "/about-us" },
    { text: "Sign Up", link: "/role" },
    { text: "Login", link: "/login" },
  ];

  const isActive = (link: string) => pathname === link;

  // Get the Total Number in Real Time From Browser Local Storage (Client Side Rendering)
  useEffect(() => {
    const listenStorageChange = () => {
      if (localStorage.getItem("numberOfFavorites")) {
        setCount(parseInt(localStorage.getItem("numberOfFavorites") as string));
      }
    };
    // Subscribe to Event `storage`
    window.addEventListener("storage", listenStorageChange);

    // Cleanup Event Listener
    return () => window.removeEventListener("storage", listenStorageChange);
  }, []);

  return (
    <Navbar className="py-1" 
    // shouldHideOnScroll 
    onMenuOpenChange={setIsMenuOpen}>
      {/* ==============LOGO WEBSITE=================== */}
      <NavbarContent>
        <NavbarBrand>
          <Link href="/">
            <Image src="/logo.svg" alt="logo" width={45} height={45} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* ============== MENU =================== */}
      <NavbarContent className="hidden sm:flex gap-4 ml-16" justify="center">
        {menuItems.slice(0, 4).map((item) => (
          <NavbarItem key={item.link}>
            <Link
              size="sm"
              href={item.link}
              className={`${
                isActive(item.link) ? "text-green-500" : "text-gray-800"
              }`}
            >
              {item.text}
              {item.text === "Favorite" && count > 0 && (
                <Badge variant="destructive" className="-mt-3">
                  {count > 9 ? "9+" : count}

                  {/* will use this when backend complate */}
                  {/* {count > 9 ? "9+" : userProfile.favoriteCards} */}
                </Badge>
              )}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* ============== SIGNUP/IN & Profile =================== */}
      <NavbarContent className="ml-16" justify="end">
        {userProfile ? (
          <NavbarItem>
            <UserNav />
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden sm:flex">
              <Link
                href="/login"
                className={`${
                  isActive("/login") ? "text-green-500" : "text-gray-800"
                }`}
              >
                Login
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link href="/role">
                <Button className="bg-[#4B9960] hidden sm:flex">Sign Up</Button>
              </Link>
            </NavbarItem>
          </>
        )}
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      </NavbarContent>

      {/* ============== RESPONSIVE MENU =================== */}
      <NavbarMenu style={{ background: isMenuOpen ? "#fff" : "#fff" }}>
        {menuItems.map((item, index) => (
          <NavbarMenuItem className="mt-5" key={`${item}-${index}`}>
            <Link
              color="foreground"
              className={`w-full ${
                isActive(item.link) ? "text-green-500" : "text-gray-800"
              }`}
              href={item.link}
              size="lg"
            >
              {item.text}
              {item.text === "Favorite" && count > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {count > 9 ? "9+" : count}
                </Badge>
              )}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export { Nav };
