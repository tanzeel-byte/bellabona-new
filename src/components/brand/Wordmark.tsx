import svgPaths from "@/lib/figma/svg-paths";

type Props = {
  className?: string;
};

/** Horizontal Bella&Bona wordmark from the Figma export. */
export function Wordmark({ className = "h-9 w-[206px]" }: Props) {
  return (
    <div className={`relative shrink-0 ${className}`} aria-hidden="true">
      <div className="absolute inset-[0.03%_47.53%_-0.04%_0]">
        <svg
          className="absolute inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 108.175 36.0036"
        >
          <g>
            <path d={svgPaths.p37503c70} fill="#024930" />
            <path d={svgPaths.pf660100} fill="#024930" />
            <path d={svgPaths.p24e03500} fill="#024930" />
            <path d={svgPaths.p1cc5c300} fill="#024930" />
            <path d={svgPaths.p95d1fa0} fill="#024930" />
          </g>
        </svg>
      </div>
      <div className="absolute inset-[0_-0.03%_-0.07%_54.5%]">
        <svg
          className="absolute inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 93.88 36.0255"
        >
          <g>
            <path d={svgPaths.p69ae600} fill="#024930" />
            <path d={svgPaths.p181cc500} fill="#024930" />
            <path d={svgPaths.p3c8eca00} fill="#024930" />
            <path d={svgPaths.p3578e680} fill="#024930" />
          </g>
        </svg>
      </div>
    </div>
  );
}
