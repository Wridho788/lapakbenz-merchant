interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-white to-accent/10 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-xl mb-4 shadow-accent p-3">
            <img src="/lapakbenz.png" alt="LapakBenz Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">LapakBenz</h2>
          <p className="text-gray-600 mt-1">Supplier Admin Panel</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>&copy; 2025 LapakBenz. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
