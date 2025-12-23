interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const ErrorState = ({ 
  title = 'Something went wrong', 
  message, 
  retry,
  action 
}: ErrorStateProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12">
      <div className="text-center max-w-md mx-auto">
        <svg
          className="mx-auto h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-gray-600">{message}</p>
        <div className="mt-6 flex gap-3 justify-center">
          {retry && (
            <button
              onClick={retry}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Error Alert Component
interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert = ({ message, onDismiss }: ErrorAlertProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 text-red-600 hover:text-red-800"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
