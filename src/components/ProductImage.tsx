import React, { useState } from "react";
import { Package } from "lucide-react";

interface ProductImageProps {
  src: string;
  alt: string;
  category?: string;
  className?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  category,
  className = "w-full h-full object-cover",
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="w-full h-full bg-[#F3F2EE] flex flex-col items-center justify-center p-6 text-center select-none">
        <Package className="w-10 h-10 text-zinc-400 stroke-[1.5] mb-2" />
        <span className="text-xs font-medium text-zinc-600 line-clamp-1">
          {alt}
        </span>
        {category && (
          <span className="text-[11px] text-zinc-400 mt-0.5">{category}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};

export default ProductImage;
