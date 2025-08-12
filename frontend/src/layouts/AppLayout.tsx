import { useState } from "react";
import { Menu, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">

      <button 
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

  
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

   
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:relative z-40 w-64 h-full 
        transition-transform duration-300 ease-in-out
      `}>
        <Navbar />
      </div>

    
      <main className="flex-1 flex h-full bg-[#FEFAE0] overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}