interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, action, icon }: EmptyStateProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12">
      <div className="text-center max-w-md mx-auto">
        {icon || (
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        )}
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};
