import { useState, useRef } from "react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging.current) handleMove(e.clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { handleMove(e.touches[0].clientX); };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-col-resize select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <img src={afterImage} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img src={beforeImage} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" style={{ minWidth: containerRef.current?.offsetWidth }} />
      </div>
      <div className="absolute top-0 bottom-0" style={{ left: `${sliderPosition}%` }}>
        <div className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground -translate-x-1/2 shadow-lg" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 gradient-primary rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
          </svg>
        </div>
      </div>
      <span className="absolute top-3 left-3 bg-foreground/70 text-background text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">{beforeLabel}</span>
      <span className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">{afterLabel}</span>
    </div>
  );
};

export default BeforeAfterSlider;
