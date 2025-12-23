import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useLogout } from '../hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navigation = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Products',
      path: '/products',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    // {
    //   name: 'Orders',
    //   path: '/orders',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    //     </svg>
    //   ),
    //   badge: 'Soon',
    // },
    // {
    //   name: 'Analytics',
    //   path: '/analytics',
    //   icon: (
    //     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    //     </svg>
    //   ),
    //   badge: 'Soon',
    // },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-primary border-r border-primary-dark transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-primary-dark">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-accent p-1.5">
              <img src="/lapakbenz.png" alt="LapakBenz Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-bold text-white">LapakBenz</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors text-white"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-primary-dark">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
              <span className="text-accent font-semibold text-sm">
                {user?.name?.charAt(0).toUpperCase() || 'S'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Supplier'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-accent text-white font-medium shadow-accent'
                  : 'text-gray-300 hover:bg-secondary'
              }`}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.name}</span>
              </div>
              {/* {item.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-secondary text-gray-300 rounded">
                  {item.badge}
                </span>
              )} */}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-primary-dark">
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-danger/20 text-danger hover:bg-danger/30 rounded-lg transition-colors disabled:opacity-50 font-medium"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className='text-gray-300'>{logoutMutation.isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar (Mobile) */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 lg:hidden">
          <div className="h-full px-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="font-bold text-gray-900">LapakBenz</span>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
