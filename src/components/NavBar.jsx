import { Book, Bookmark, User } from "lucide-react"; 
import { useState, useEffect } from "react";  

export default function NavBar() {   
  const [name, setName] = useState("Benita");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track if the mobile menu is open

  useEffect(() => {     
    async function getName() {       
      const TOKEN = localStorage.getItem('token');       
      const response = await fetch('https://bookcorner.pythonanywhere.com/api/me', {         
        headers: {           
          'Authorization': `Bearer ${TOKEN}`         
        }       
      });       
      const username = await response.json();       
      setName(username);     
    }     
    getName();   
  }, []);   

  return (     
    <header className="sticky top-0 z-50 bg-amber-900/95 backdrop-blur-sm text-amber-50 py-6 px-4 shadow-lg">       
      <div className="max-w-6xl mx-auto flex justify-between items-center">         
        <h1 className="text-3xl font-serif font-medium">           
          {name}'s Corner of Books         
        </h1>         
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6"> 
          <button 
            onClick={() => window.location.href = '/'} 
            className="flex items-center gap-2 hover:text-amber-200 transition-all duration-300 hover:scale-105"
          >             
            <Book size={20} />             
            <span>Bookshelf</span>           
          </button>           
          <button 
            onClick={() => window.location.href = '/library'} 
            className="flex items-center gap-2 hover:text-amber-200 transition-all duration-300 hover:scale-105"
          >             
            <Bookmark size={20} />             
            <span>Reading List</span>           
          </button>           
          <button 
            className="flex items-center gap-2 hover:text-amber-200 transition-all duration-300 hover:scale-105"
          >             
            <User size={20} />             
            <span>Profile</span>           
          </button>         
        </nav> 

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button 
            className="text-amber-50 hover:text-amber-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle the menu state
          >
            {/* Hamburger icon for mobile menu */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu: Only shows when isMenuOpen is true */}
      {isMenuOpen && (
        <div className="md:hidden bg-amber-900/95 text-amber-50 py-4 px-4">
          <nav className="flex flex-col gap-4">
            <button 
              onClick={() => window.location.href = '/'} 
              className="flex items-center gap-2 hover:text-amber-200 transition-all duration-300 hover:scale-105"
            >             
              <Book size={20} />             
              <span>Bookshelf</span>           
            </button>
            <button 
              onClick={() => window.location.href = '/library'} 
              className="flex items-center gap-2 hover:text-amber-200 transition-all duration-300 hover:scale-105"
            >             
              <Bookmark size={20} />             
              <span>Reading List</span>           
            </button>
            <button 
              className="flex items-center gap-2 hover:text-amber-200 transition-all duration-300 hover:scale-105"
            >             
              <User size={20} />             
              <span>Profile</span>           
            </button>
          </nav>
        </div>
      )}
    </header>   
  ); 
}
