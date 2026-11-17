import Image from "next/image";
import { cn } from "~/lib/utils";
import { nc } from "~/src/notcms/schema";

type Writer = (typeof nc.query.writers.$inferPages)[number];

/**
 * A post's thumbnail. Posts without one get a neutral placeholder of the same
 * size, so the cards in a list stay aligned.
 */
export function PostThumbnail({
  src,
  sizes,
  className,
}: {
  src?: string;
  sizes: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-white/15 to-white/[0.03]",
        className
      )}
    >
      {src && (
        // The title is next to the image, so the image itself is decorative.
        <Image src={src} alt="" fill sizes={sizes} className="object-cover" />
      )}
    </div>
  );
}

/** A writer's profile image, or the first letter of their name without one. */
export function WriterAvatar({
  writer,
  size,
  className,
}: {
  writer: Writer;
  size: number;
  className?: string;
}) {
  const src = writer.properties.images?.[0];
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-white/15 font-medium text-white",
        className
      )}
    >
      {writer.title.charAt(0).toUpperCase()}
    </span>
  );
}

/** The date a post was created, or nothing when the property is empty. */
export function PostDate({
  value,
  className,
}: {
  value: string | null | undefined;
  className?: string;
}) {
  if (!value) return null;
  return (
    <time dateTime={value} className={className}>
      {new Date(value).toLocaleDateString()}
    </time>
  );
}
