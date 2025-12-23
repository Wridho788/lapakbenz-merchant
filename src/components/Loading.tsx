// Loading Components

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent ${sizeClasses[size]}`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function ContentLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Skeleton Loaders
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// export function ProductListSkeleton({ count = 8 }: { count?: number }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//       {Array.from({ length: count }).map((_, i) => (
//         <ProductCardSkeleton key={i} />
//       ))}
//     </div>
//   );
// }
