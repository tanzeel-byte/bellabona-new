import type { HTMLAttributes } from "react";

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  /** Narrow variant for text-heavy sections (max-width 960). */
  narrow?: boolean;
};

/**
 * Page container. Caps width at 1280 (the Figma `Container/container-large`
 * token) and applies the 64px page padding (`Page Padding/padding-global`)
 * that mirrors the design.
 */
export function Container({
  className = "",
  narrow = false,
  children,
  ...props
}: ContainerProps) {
  const maxWidth = narrow ? "max-w-[960px]" : "max-w-[1280px]";
  return (
    <div
      className={`mx-auto w-full ${maxWidth} px-6 md:px-10 lg:px-16 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
