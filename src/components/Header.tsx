
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">Mobiwave</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
          <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
          <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/dashboard">Client Portal</Link>
            </Button>
            <Button asChild variant="default" size="sm">
              <Link to="/admin">Admin Portal</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};
