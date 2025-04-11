"use client";

import Image from "next/image";
import { useState, useRef } from "react";

const ZoomableImage = ({ src, alt }: { src: string; alt: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, show: false });
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x: e.clientX - left, y: e.clientY - top, show: true });
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div className="relative overflow-hidden group h-full">
      <div
        ref={imageRef}
        className="relative h-full w-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPosition({ ...position, show: false })}
      >
        <Image src={src} alt={alt} width={300} height={300} className="object-contain" />

        {/* Zoomed Area */}
        {position.show && (
          <div
            className="absolute pointer-events-none border-2 border-white rounded-full"
            style={{
              left: `${position.x - 50}px`,
              top: `${position.y - 50}px`,
              width: "100px",
              height: "100px",
              backgroundImage: `url(${src})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: backgroundPosition,
              backgroundSize: "200%",
              zIndex: 10,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ZoomableImage;
