"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Globe, Menu, User } from "lucide-react";
import { Button } from "./ui/button";
import { GlobalSettingsModal } from "./GlobalSettingsModal";
import { gsap } from "gsap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
        
        if (navRef.current) {
          if (scrolled) {
            // Animate to scrolled state
            gsap.to(navRef.current, {
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              duration: 0.3,
              ease: "power2.out"
            });
          } else {
            // Animate to transparent state
            gsap.to(navRef.current, {
              backgroundColor: "rgba(255, 255, 255, 0)",
              boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      }
    };
    
    handleScroll(); // Check initial state
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  return (
    <>
      <nav 
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-12 py-4 lg:py-6 transition-colors duration-300"
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFB400] flex items-center justify-center">
              <span className="font-bold text-xl text-white">S</span>
            </div>
            <span 
              className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                isScrolled ? "text-[#283B73]" : "text-white"
              }`}
            >
              Staysia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            <Link 
              href="#stays" 
              className={`font-medium text-lg tracking-wide transition-colors duration-300 ${
                isScrolled 
                  ? "text-gray-700 hover:text-[#283B73]" 
                  : "text-white/90 hover:text-white"
              }`}
              style={{ fontFamily: "'Saira Condensed', sans-serif" }}
            >
              STAYS
            </Link>
            <Link 
              href="#wishlists" 
              className={`font-medium text-lg tracking-wide transition-colors duration-300 ${
                isScrolled 
                  ? "text-gray-700 hover:text-[#283B73]" 
                  : "text-white/90 hover:text-white"
              }`}
              style={{ fontFamily: "'Saira Condensed', sans-serif" }}
            >
              WISHLISTS
            </Link>
            <Link 
              href="#bookings" 
              className={`font-medium text-lg tracking-wide transition-colors duration-300 ${
                isScrolled 
                  ? "text-gray-700 hover:text-[#283B73]" 
                  : "text-white/90 hover:text-white"
              }`}
              style={{ fontFamily: "'Saira Condensed', sans-serif" }}
            >
              BOOKINGS
            </Link>
            <Link 
              href="#contact" 
              className={`font-medium text-lg tracking-wide transition-colors duration-300 ${
                isScrolled 
                  ? "text-gray-700 hover:text-[#283B73]" 
                  : "text-white/90 hover:text-white"
              }`}
              style={{ fontFamily: "'Saira Condensed', sans-serif" }}
            >
              CONTACT US
            </Link>
            <Button 
              className={`font-semibold px-6 py-2 rounded-full transition-all duration-300 ${
                isScrolled
                  ? "bg-[#283B73] text-white hover:bg-[#1e2d5a]"
                  : "bg-white text-[#283B73] hover:bg-white/90"
              }`}
            >
              Become a host
            </Button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`transition-colors duration-300 p-2 rounded-full ${
                isScrolled
                  ? "text-gray-700 hover:text-[#283B73] hover:bg-gray-100"
                  : "text-white hover:text-white/90 hover:bg-white/10"
              }`}
              aria-label="Language and currency settings"
            >
              <Globe className="w-6 h-6" />
            </button>
            {/* Pill-shaped Menu Button - Desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-300 shadow-sm ${
                    isScrolled
                      ? "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                      : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                  }`}
                  aria-label="Menu"
                >
                  <Menu className="w-5 h-5" />
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  Log in or Sign up
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Become a Host
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Help Center
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tablet/Mobile Right Section */}
          <div className="lg:hidden flex items-center gap-3">
            {/* Globe icon - visible on tablet */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className={`hidden sm:block transition-colors duration-300 p-2 rounded-full ${
                isScrolled
                  ? "text-gray-700 hover:text-[#283B73] hover:bg-gray-100"
                  : "text-white hover:text-white/90 hover:bg-white/10"
              }`}
              aria-label="Language and currency settings"
            >
              <Globe className="w-6 h-6" />
            </button>
            
            {/* Menu Button - Mobile & Tablet */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-full transition-all shadow-sm border border-gray-200">
                  <Menu className="w-5 h-5" />
                  <div className="w-7 h-7 bg-gray-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  Log in or Sign up
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Become a Host
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Help Center
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Global Settings Modal */}
      <GlobalSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}