import Image from 'next/image';
import dimensions from '@/content/image-metadata.json';
export function Media({
  src,
  alt,
  className = '',
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`media ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={
          (dimensions as Record<string, { width: number; height: number }>)[src]
            ?.width ?? 1024
        }
        height={
          (dimensions as Record<string, { width: number; height: number }>)[src]
            ?.height ?? 1536
        }
        priority={priority}
        unoptimized
        sizes="(max-width: 700px) 100vw, 50vw"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
