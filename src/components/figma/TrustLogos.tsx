import svgPaths from "@/lib/figma/svg-paths";

export function IfcoLogo({ className = "h-[33.659px] w-[111.288px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 111.288 33.6591"
      aria-hidden="true"
    >
      <g clipPath="url(#ifco-clip)">
        <path d={svgPaths.p2bade80} fill="#A9A9A9" />
        <path d={svgPaths.p8fa0a00} fill="#A9A9A9" />
        <path d={svgPaths.p2f11e930} fill="#A9A9A9" />
        <path d={svgPaths.p8379f00} fill="#A9A9A9" />
      </g>
      <defs>
        <clipPath id="ifco-clip">
          <rect fill="white" height="33.6591" width="111.288" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function AtollsLogo({ className = "h-[46.313px] w-[190.856px]" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 185.21 38.6441"
      aria-hidden="true"
    >
      <path d={svgPaths.p1f3780} fill="#A9A9A9" />
    </svg>
  );
}
