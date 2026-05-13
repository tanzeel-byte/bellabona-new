import svgPaths from "@/lib/figma/svg-paths";

export function AppStoreBadge({ className = "h-[59.971px] w-[179.41px]" }: { className?: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0">
        <svg
          className="absolute inset-0 block size-full"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 179.914 59.9714"
        >
          <path d={svgPaths.p8e8b600} fill="black" />
        </svg>
        <div className="absolute inset-[21.8%_76.8%_23.76%_8.36%]">
          <svg
            className="absolute inset-0 block size-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 26.6367 32.6503"
          >
            <path d={svgPaths.p25772c00} fill="white" />
            <path d={svgPaths.p372be400} fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[44.68%_8.25%_16.27%_28.86%]">
          <svg
            className="absolute inset-0 block size-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 112.829 23.4216"
          >
            <path d={svgPaths.p381f500} fill="white" />
            <path d={svgPaths.p340dc880} fill="white" />
            <path d={svgPaths.p691c400} fill="white" />
            <path d={svgPaths.p26665580} fill="white" />
            <path d={svgPaths.p2076d580} fill="white" />
            <path d={svgPaths.p2727d9f2} fill="white" />
            <path d={svgPaths.pdc34b00} fill="white" />
            <path d={svgPaths.p1fb50900} fill="white" />
          </svg>
        </div>
        <div className="absolute inset-[20.63%_39.44%_63.01%_29.9%]">
          <svg
            className="absolute inset-0 block size-full"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 55.0086 9.80991"
          >
            <path d={svgPaths.p313e9cf2} fill="white" />
            <path d={svgPaths.p33327680} fill="white" />
            <path d={svgPaths.p312898f0} fill="white" />
            <path d={svgPaths.p35030e00} fill="white" />
            <path d={svgPaths.p10306700} fill="white" />
            <path d={svgPaths.p20b4f80} fill="white" />
            <path d={svgPaths.p15a65f00} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function GoogleReviewsBadge({
  className = "h-[40.481px] w-[138.162px]",
}: {
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 138.162 40.4806"
      aria-hidden="true"
    >
      <path d={svgPaths.pea83d00} fill="#4285F4" />
      <path d={svgPaths.p2a215100} fill="#34A853" />
      <path d={svgPaths.pd55f100} fill="#FDA61C" />
      <path d={svgPaths.p1d431500} fill="#EA4335" />
      <path d={svgPaths.p142c9680} fill="#1A211E" />
      <path d={svgPaths.pd6296f1} fill="#1A211E" />
      <path d={svgPaths.p1f60cc00} fill="#1A211E" />
      <path d={svgPaths.p2ec5ca00} fill="#1A211E" />
      <path d={svgPaths.p2f5f1ff0} fill="#1A211E" />
      <path d={svgPaths.p3834d100} fill="#1A211E" />
      <path d={svgPaths.p5fcb080} fill="#25333F" />
    </svg>
  );
}
