import React, { useState, useContext } from 'react';
import logo from '../Image/logo.png';
import { CiMenuBurger } from 'react-icons/ci';
import { FaSearchDollar } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext); // ✅ login user info
  const role = user?.role;

  // 🔐 Sign out handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // or whatever you use
    setUser(null);
    navigate('/login');
  };

  // ✅ Role & Login-based Menu Items
  const navItems = [
    {
      label: 'Dashboard',
      path: role === 'admin' ? '/admin-dashboard' : '/buyer-dashboard',
      show: !!user
    },
    {
      label: 'Login',
      path: '/login',
      show: !user
    },
    {
      label: 'Sign-Out',
      path: '#',
      show: !!user,
      onClick: handleLogout
    },
    {
      label: 'Dollar-Buy',
      path: '/dollar-buy',
      show: role === 'buyer'
    },
    {
      label: 'Dollar-Upload',
      path: '/dollar-upload',
      show: role === 'admin'
    },
    {
      label: 'Uploaded-History',
      path: '/uploaded-history',
      show: role === 'admin'
    },
    {
      label: 'Dollar-Status',
      path: '/dollar-status-admin',
      show: role === 'admin'
    }
  ];

  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2 text-xl font-bold text-green-800">
            <img src={logo} className="logo w-8 h-8 object-contain" alt="logo" />
            <span>$ Management</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems
              .filter(item => item.show)
              .map(item =>
                item.onClick ? (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="text-sm text-gray-700 hover:text-red-500 font-medium"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="text-sm text-gray-700 hover:text-blue-600 font-medium"
                  >
                    {item.label}
                  </Link>
                )
              )}

            <NavLink
              className="text-xl text-gray-700 hover:text-blue-600 font-medium"
              to="/dollar-status"
            >
              <FaSearchDollar />
            </NavLink>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              <CiMenuBurger className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-200">
          {navItems
            .filter(item => item.show)
            .map(item =>
              item.onClick ? (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setMenuOpen(false);
                  }}
                  className="block text-sm text-gray-700 hover:text-red-500 font-medium"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm text-gray-700 hover:text-blue-600 font-medium"
                >
                  {item.label}
                </Link>
              )
            )}
        </div>
      )}
    </header>
  );
};

export default NavBar;
