export function FeaturedProductsFallback() {
  return (
    <div className="py-12">
      <ul className="grid grid-cols-1 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="animate-pulse">
            <div className="bg-muted h-8 w-48 rounded" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-muted aspect-square rounded-lg" />
              <div className="bg-muted aspect-square rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
