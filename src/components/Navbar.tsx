
import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Menu, X, User, LogOut, LayoutDashboard, UserCircle, Store } from 'lucide-react';
import { NAV_LINKS } from '@/constants';
import { UserRole } from '@/types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  user: { name: string; email: string; role?: UserRole; photoURL?: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  cartCount, 
  onCartClick, 
  user, 
  onLoginClick, 
  onLogoutClick,
  currentPath,
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleNavClick = (path: string) => {
    onNavigate(path);
    setIsMenuOpen(false);
  };

  const isSellerOrAdmin = user?.role === 'seller' || user?.role === 'admin';

  // Construct Links based on role
  let displayLinks = [...NAV_LINKS];

  if (isSellerOrAdmin) {
    // Remove 'Marketplace' for sellers/admins
    displayLinks = displayLinks.filter(link => link.label !== 'Marketplace');
    
    // Add 'Dashboard' after 'Home'
    const homeIndex = displayLinks.findIndex(l => l.label === 'Home');
    if (homeIndex !== -1) {
        displayLinks.splice(homeIndex + 1, 0, { label: user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard', path: user?.role === 'admin' ? '/admin-dashboard' : '/seller-dashboard' });
    } else {
        displayLinks.push({ label: user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard', path: user?.role === 'admin' ? '/admin-dashboard' : '/seller-dashboard' });
    }
  }

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer" 
            onClick={() => onNavigate('/')}
          >
            <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center text-white font-serif font-bold">
              T
            </div>
            <span className="font-serif text-2xl font-bold text-brand-blue tracking-tight">
              Tatak Norte
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {displayLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPath === link.path 
                    ? 'text-brand-blue font-bold' 
                    : 'text-stone-600 hover:text-brand-blue'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* User Auth */}
            <div className="relative" ref={profileRef}>
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-stone-200 hover:bg-white hover:shadow-sm transition-all"
                  >
                    <div className="w-8 h-8 bg-brand-light text-brand-blue rounded-full flex items-center justify-center font-bold overflow-hidden border border-stone-100">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className="text-sm font-medium text-stone-700 hidden sm:block">{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {isProfileOpen && (
                    <>
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-stone-100 py-1 z-20 animate-fade-in-up">
                        <div className="px-4 py-3 border-b border-stone-100">
                          <p className="text-xs text-stone-500">Signed in as</p>
                          <p className="text-sm font-bold text-brand-blue truncate">{user.email}</p>
                          {user.role && user.role !== 'customer' && (
                             <span className="inline-block mt-1 px-2 py-0.5 bg-brand-blue text-white text-[10px] rounded-full uppercase tracking-wider">
                               {user.role}
                             </span>
                          )}
                        </div>
                        
                        <button 
                            onClick={() => {
                              onNavigate('/profile');
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                          >
                            <UserCircle className="w-4 h-4" /> My Profile
                          </button>

                         {!isSellerOrAdmin && (
                             <button 
                                onClick={() => {
                                  onNavigate('/seller-registration');
                                  setIsProfileOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                              >
                                <Store className="w-4 h-4" /> Seller Registration
                              </button>
                         )}

                        {isSellerOrAdmin && (
                           <button 
                            onClick={() => {
                              onNavigate(user?.role === 'admin' ? '/admin-dashboard' : '/seller-dashboard');
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                          >
                            <LayoutDashboard className="w-4 h-4" /> {user?.role === 'admin' ? 'Admin Dashboard' : 'Seller Dashboard'}
                          </button>
                        )}
                        <div className="border-t border-stone-100 my-1"></div>
                        <button 
                          onClick={() => {
                            onLogoutClick();
                            setIsProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-stone-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="p-2 text-stone-600 hover:text-brand-blue transition-colors flex items-center gap-1"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:block">Login</span>
                </button>
              )}
            </div>

            {!isSellerOrAdmin && (
              <button 
                onClick={onCartClick}
                className="p-2 text-stone-600 hover:text-brand-blue transition-colors relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-accent rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-stone-600 hover:text-brand-blue"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-cream border-t border-stone-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {displayLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  currentPath === link.path 
                    ? 'bg-brand-blue text-white' 
                    : 'text-stone-600 hover:bg-brand-light hover:text-brand-blue'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
