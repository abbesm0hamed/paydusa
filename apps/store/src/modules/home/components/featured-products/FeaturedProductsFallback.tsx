export function FeaturedProductsFallback() {
  return (
    <div className="py-12">
      <ul className="grid grid-cols-1 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="aspect-square bg-muted rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
