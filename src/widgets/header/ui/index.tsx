import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearLocalStorage, useAuth } from 'shared/services';

export const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearLocalStorage();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-[1000] flex items-center justify-between bg-[#001529] px-6 h-16 shadow-md sm:px-4 sm:h-14">
      <span className="text-white text-base font-medium sm:text-sm">
        Welcome, {user?.email || 'User'}
      </span>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center h-10 text-sm sm:h-9 sm:text-xs sm:px-3 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out cursor-pointer"
        aria-label="Logout"
      >
        <LogOut />
        Logout
      </button>
    </header>
  );
};

