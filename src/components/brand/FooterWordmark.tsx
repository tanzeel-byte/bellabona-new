import svgPaths from "@/lib/figma/svg-paths";

export function FooterWordmark() {
  return (
    <div aria-hidden="true" className="mt-16 w-full overflow-hidden md:mt-24">
      <div className="relative aspect-[1509/264] w-full max-w-[1509px]">
        <svg
          className="absolute left-0 top-[0.08px] h-[99.81%] w-[52.45%]"
          fill="none"
          preserveAspectRatio="xMinYMid meet"
          viewBox="0 0 791.682 263.498"
        >
          <path d={svgPaths.p36099380} fill="#E6FFA9" />
          <path d={svgPaths.p5e55b80} fill="#E6FFA9" />
          <path d={svgPaths.p7d04300} fill="#E6FFA9" />
          <path d={svgPaths.p17478500} fill="#E6FFA9" />
          <path d={svgPaths.p39bc1680} fill="#E6FFA9" />
        </svg>
        <svg
          className="absolute left-[54.48%] top-0 h-full w-[45.52%]"
          fill="none"
          preserveAspectRatio="xMinYMid meet"
          viewBox="0 0 687.067 263.655"
        >
          <path d={svgPaths.p2a871480} fill="#E6FFA9" />
          <path d={svgPaths.p4e1da00} fill="#E6FFA9" />
          <path d={svgPaths.p36a8ba00} fill="#E6FFA9" />
          <path d={svgPaths.p165a60f0} fill="#E6FFA9" />
        </svg>
      </div>
    </div>
  );
}
