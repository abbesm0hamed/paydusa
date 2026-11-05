import { Container } from "@medusajs/ui";
import Image from "next/image";

interface ImageGalleryProps {
  images: {
    id: string;
    url: string;
    alt?: string;
  }[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => (
  <div className="relative flex items-start">
    <div className="small:mx-16 flex flex-1 flex-col gap-y-4">
      {images.map((image, index) => (
        <Container
          key={image.id}
          className="bg-ui-bg-subtle relative aspect-[29/34] w-full overflow-hidden"
          id={image.id}
        >
          {!!image.url && (
            <Image
              src={image.url}
              priority={index <= 2 ? true : false}
              className="rounded-rounded absolute inset-0"
              alt={image.alt || `Product image ${index + 1}`}
              fill
              sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
              style={{
                objectFit: "cover",
              }}
            />
          )}
        </Container>
      ))}
    </div>
  </div>
);

export default ImageGallery;
