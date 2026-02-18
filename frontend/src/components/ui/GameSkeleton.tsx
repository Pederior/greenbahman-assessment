export function GamesSkeleton() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="h-10 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-full md:w-64 h-20 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-12" />
                <div className="h-4 bg-gray-200 rounded w-12" />
              </div>
              <div className="flex gap-1">
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-5 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}