export default function Loading() {
  return (
    <div className="pt-16 pb-24">
      <div className="h-[400px] bg-gray-200 animate-pulse" />
      <div className="content-container mt-12 space-y-8">
        <div className="h-8 w-3/4 bg-gray-200 animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
        <div className="h-64 bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 bg-gray-200 animate-pulse" />
          <div className="h-40 bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
