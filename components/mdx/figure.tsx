interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
}

export function Figure({ src, alt, caption }: FigureProps) {
  return (
    <figure className="my-8">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="w-full border border-[var(--border)] rounded-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-xs text-[var(--fg-muted)] text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
