import React from 'react';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar />
      <MobileNav />
      
      <div className="flex-1 md:ml-64 p-6 pt-20 md:pt-6">
        <div className="container mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
