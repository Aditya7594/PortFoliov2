'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HeroBackground = () => {
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  // Fixed initial positions and scales for server-side rendering
  const initialPositions = Array(20).fill(null).map((_, i) => ({
    x: (i * 100) % 1000,
    y: (i * 100) % 800,
    scale: 1.5 + (i % 3) * 0.5
  }));

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Floating particles */}
      {initialPositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-500 rounded-full"
          initial={{
            x: pos.x,
            y: pos.y,
            scale: pos.scale,
          }}
          animate={mounted ? {
            y: [null, Math.random() * dimensions.height],
            opacity: [0, 1, 0],
          } : {}}
          transition={{
            duration: 3 + (i % 2),
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Box animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="loader">
          <div className="box box0">
            <div></div>
          </div>
          <div className="box box1">
            <div></div>
          </div>
          <div className="box box2">
            <div></div>
          </div>
          <div className="box box3">
            <div></div>
          </div>
          <div className="box box4">
            <div></div>
          </div>
          <div className="box box5">
            <div></div>
          </div>
          <div className="box box6">
            <div></div>
          </div>
          <div className="box box7">
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBackground; 