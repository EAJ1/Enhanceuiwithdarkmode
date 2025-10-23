import React from 'react';
import { motion } from 'motion/react';

export function AnimatedBackground() {
  // Floating orbs configuration
  const orbs = [
    { size: 300, color: 'from-orange-500/20 to-orange-600/10', delay: 0, duration: 20, x: '20%', y: '10%' },
    { size: 400, color: 'from-orange-400/15 to-amber-500/10', delay: 2, duration: 25, x: '70%', y: '60%' },
    { size: 250, color: 'from-orange-600/20 to-red-600/10', delay: 4, duration: 18, x: '50%', y: '80%' },
    { size: 350, color: 'from-amber-500/15 to-orange-500/10', delay: 1, duration: 22, x: '80%', y: '20%' },
    { size: 200, color: 'from-orange-500/25 to-orange-700/10', delay: 3, duration: 16, x: '10%', y: '70%' },
  ];

  // Grid lines
  const gridLines = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Overlay - adapts to light/dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/30 to-orange-100/40 dark:from-black dark:via-black dark:to-orange-950/30" />

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-5 dark:opacity-5">
        <svg className="w-full h-full">
          {gridLines.map((i) => (
            <motion.line
              key={`h-${i}`}
              x1="0"
              y1={`${i * 5}%`}
              x2="100%"
              y2={`${i * 5}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-orange-500"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
            />
          ))}
          {gridLines.map((i) => (
            <motion.line
              key={`v-${i}`}
              x1={`${i * 5}%`}
              y1="0"
              x2={`${i * 5}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="1"
              className="text-orange-500"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 1 }}
            />
          ))}
        </svg>
      </div>

      {/* Floating Orbs */}
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl opacity-40 dark:opacity-100`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            x: [0, 50, -30, 40, 0],
            y: [0, -40, 60, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Particles */}
      {Array.from({ length: 30 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-orange-400 dark:bg-orange-500 rounded-full opacity-40 dark:opacity-100"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -500],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Glowing Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-10">
        <motion.path
          d="M0,100 Q250,50 500,100 T1000,100"
          stroke="url(#gradient1)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
        />
        <motion.path
          d="M0,200 Q300,150 600,200 T1200,200"
          stroke="url(#gradient2)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut", delay: 1 }}
        />
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fb923c" stopOpacity="0" />
            <stop offset="50%" stopColor="#fb923c" stopOpacity="1" />
            <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Rotating Rings */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border-2 border-orange-300/30 dark:border-orange-500/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full border-2 border-orange-300/30 dark:border-orange-400/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />

      {/* Scanline Effect */}
      <motion.div
        className="absolute left-0 right-0 h-32 bg-gradient-to-b from-transparent via-orange-300/10 dark:via-orange-500/10 to-transparent"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
