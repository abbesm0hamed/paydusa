import repeat from "@lib/util/repeat";
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview";

const SkeletonProductGrid = ({
  numberOfProducts = 8,
}: {
  numberOfProducts?: number;
}) => (
  <ul
    className="small:grid-cols-3 medium:grid-cols-4 grid flex-1 grid-cols-2 gap-x-6 gap-y-8"
    data-testid="products-list-loader"
  >
    {repeat(numberOfProducts).map((index) => (
      <li key={index}>
        <SkeletonProductPreview />
      </li>
    ))}
  </ul>
);

export default SkeletonProductGrid;
