import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-extrabold text-[#2872A1]">404</h1>
      <h2 className="text-xl font-bold text-[#172B3A] mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary">
            <Home className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
