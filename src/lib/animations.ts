"use client";

import { Variants, Transition } from "framer-motion";

/**
 * Framer Motion Animation System
 *
 * Pro-level micro-interactions for FOF Christmas Edition
 * Includes variants for pages, buttons, cards, and decorative elements
 */

// ===== TRANSITIONS =====

export const springTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const smoothTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export const bounceTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 15,
};

export const gentleTransition: Transition = {
  type: "tween",
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94],
};

// ===== PAGE TRANSITIONS =====

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
    },
  },
};

export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
  exit: { opacity: 0, y: -20 },
};

export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
  exit: { opacity: 0 },
};

export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springTransition,
  },
  exit: { opacity: 0, scale: 0.95 },
};

// ===== BUTTON INTERACTIONS =====

export const buttonVariants: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: springTransition,
  },
  tap: {
    scale: 0.97,
    transition: { duration: 0.1 },
  },
  disabled: {
    opacity: 0.5,
    scale: 1,
  },
};

export const primaryButtonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 4px 20px rgba(233, 69, 96, 0.3)",
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 8px 30px rgba(233, 69, 96, 0.5)",
    transition: springTransition,
  },
  tap: {
    scale: 0.97,
    boxShadow: "0 2px 10px rgba(233, 69, 96, 0.3)",
    transition: { duration: 0.1 },
  },
};

export const goldButtonVariants: Variants = {
  initial: {
    scale: 1,
    boxShadow: "0 4px 20px rgba(255, 215, 0, 0.3)",
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 8px 30px rgba(255, 215, 0, 0.5)",
    transition: springTransition,
  },
  tap: {
    scale: 0.97,
    boxShadow: "0 2px 10px rgba(255, 215, 0, 0.3)",
    transition: { duration: 0.1 },
  },
};

// ===== CARD ANIMATIONS =====

export const cardVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...smoothTransition,
      staggerChildren: 0.1,
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: springTransition,
  },
};

export const glassCardVariants: Variants = {
  initial: {
    opacity: 0,
    backdropFilter: "blur(0px)",
  },
  animate: {
    opacity: 1,
    backdropFilter: "blur(20px)",
    transition: { duration: 0.5 },
  },
};

// ===== IMAGE ANIMATIONS =====

export const imageRevealVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const imageFrameVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    boxShadow: "0 0 0 rgba(255, 215, 0, 0)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    boxShadow: "0 0 60px rgba(255, 215, 0, 0.4)",
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
  celebration: {
    boxShadow: [
      "0 0 60px rgba(255, 215, 0, 0.4)",
      "0 0 100px rgba(255, 215, 0, 0.6)",
      "0 0 60px rgba(255, 215, 0, 0.4)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ===== STAGGER CHILDREN =====

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItemVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: smoothTransition,
  },
};

// ===== FLOATING ELEMENTS =====

export const floatVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const pulseVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const sparkleVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 0.8],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const floatSnowVariants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: -12,
    rotate: 10,
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const floatGiftVariants: Variants = {
  initial: { y: 0, rotate: -3 },
  animate: {
    y: -15,
    rotate: 3,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const floatCoinVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: -10,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const orbitVariants: Variants = {
  animate: {
    transform: [
      "translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg)",
      "translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg)",
    ],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const float1Variants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: -15,
    rotate: 10,
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const float2Variants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: -20,
    rotate: -5,
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const float3Variants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: {
    y: -10,
    rotate: 15,
    transition: {
      duration: 3.5,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const spinSlowVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ===== PROGRESS ANIMATIONS =====

export const progressBarVariants: Variants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export const shimmerVariants: Variants = {
  initial: { x: "-100%" },
  animate: {
    x: "100%",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const goldShimmerVariants: Variants = {
  initial: { backgroundPosition: "150% 0" },
  animate: {
    backgroundPosition: "-50% 0",
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const pulseGlowVariants: Variants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: 1.05,
    opacity: 1,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const pulseRippleVariants: Variants = {
  initial: { scale: 1, boxShadow: "0 0 0 0 rgba(255, 215, 0, 0.4)" },
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 0 0 rgba(255, 215, 0, 0.4)",
      "0 0 0 10px rgba(255, 215, 0, 0)",
      "0 0 0 0 rgba(255, 215, 0, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ===== CELEBRATION =====

export const confettiPieceVariants: Variants = {
  initial: {
    y: -20,
    opacity: 0,
    rotate: 0,
  },
  animate: (i: number) => ({
    y: "100vh",
    opacity: [0, 1, 1, 0],
    rotate: [0, 360, 720],
    transition: {
      duration: 3 + Math.random() * 2,
      delay: i * 0.05,
      ease: "linear",
    },
  }),
};

export const pointsPopVariants: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.3, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ===== LOADING STATES =====

export const spinnerVariants: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const dotsVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const dotVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ===== MASCOT ANIMATIONS =====

export const mascotVariants: Variants = {
  idle: {
    y: [0, -5, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  thinking: {
    rotate: [-2, 2, -2],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  celebrating: {
    scale: [1, 1.1, 1],
    rotate: [-5, 5, -5],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  sad: {
    y: [0, 3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const bobVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: -5,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const bobSadVariants: Variants = {
  initial: { y: 0, rotate: -2 },
  animate: {
    y: -5,
    rotate: 2,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

export const flickerVariants: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: 0.3,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

// ===== SNOWFLAKE ANIMATIONS =====

export const snowflakeVariants: Variants = {
  initial: (i: number) => ({
    y: -20,
    x: 0,
    opacity: 0,
    rotate: 0,
  }),
  animate: (i: number) => ({
    y: "100vh",
    x: [0, 30, -30, 0],
    opacity: [0, 0.6, 0.6, 0],
    rotate: [0, 180, 360],
    transition: {
      duration: 8 + Math.random() * 4,
      delay: i * 0.3,
      repeat: Infinity,
      ease: "linear",
    },
  }),
};

// ===== NOTIFICATION / TOAST =====

export const toastVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

// ===== MODAL / OVERLAY =====

export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.2 },
  },
};
