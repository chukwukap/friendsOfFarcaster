"use client";

import { forwardRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children?: React.ReactNode;
    variant?: "primary" | "secondary" | "gold" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

/**
 * Creative Button with 3D offset/embossed border style
 * Features:
 * - Distinctive offset shadow border (right + bottom)
 * - Light fill with dark text for maximum contrast
 * - Spring-based hover animations
 * - Press effect with offset reduction
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            fullWidth = false,
            loading = false,
            icon,
            className = "",
            disabled,
            ...props
        },
        ref
    ) => {
        const [isPressed, setIsPressed] = useState(false);
        const [isHovered, setIsHovered] = useState(false);

        const variants = {
            primary: cn(
                "bg-white text-[#1a1a2e]",
                "border-r-[5px] border-b-[5px] border-[#8b5cf6]",
                "border-t border-l border-[#8b5cf6]/20",
                "shadow-[0_2px_8px_rgba(139,92,246,0.15)] inner-shadow-[0_1px_0_rgba(255,255,255,0.9)]",
                isHovered && "brightness-105 border-r-[#a78bfa] border-b-[#a78bfa] shadow-[0_4px_16px_rgba(139,92,246,0.25)]",
                isPressed && "border-r-[2px] border-b-[2px] translate-x-[3px] translate-y-[3px]"
            ),
            secondary: cn(
                "bg-white/8 backdrop-blur-xl text-white/95",
                "border-r-[3px] border-b-[3px] border-white/25",
                "border-t border-l border-white/10",
                isHovered && "bg-white/12 border-r-white/35 border-b-white/35",
                isPressed && "border-r-[1px] border-b-[1px] translate-x-[2px] translate-y-[2px]"
            ),
            gold: cn(
                "bg-linear-to-b from-[#fffdf7] to-[#fff9e6] text-[#78350f] font-bold tracking-wider",
                "border-r-[5px] border-b-[5px] border-[#f59e0b]",
                "border-t border-l border-[#f59e0b]/30",
                "shadow-[0_2px_12px_rgba(245,158,11,0.2)] inner-shadow-[0_1px_0_white]",
                "relative overflow-hidden",
                "before:content-[''] before:absolute before:inset-0 before:bg-linear-[105deg,transparent_40%,rgba(255,255,255,0.4)_50%,transparent_60%] before:bg-[length:200%_100%] before:bg-[150%_0] before:transition-[background-position] before:duration-400 before:pointer-events-none",
                isHovered && "brightness-105 border-r-[#fbbf24] border-b-[#fbbf24] shadow-[0_4px_20px_rgba(245,158,11,0.35)] before:bg-[-50%_0]",
                isPressed && "border-r-[2px] border-b-[2px] translate-x-[3px] translate-y-[3px]"
            ),
            ghost: cn(
                "bg-transparent text-white/70 font-medium normal-case tracking-normal border-none",
                isHovered && "text-white bg-white/6",
                isPressed && "bg-white/10"
            )
        };

        const sizes = {
            sm: "h-[44px] px-5 text-[13px] rounded-[10px]",
            md: "h-[52px] px-7 text-[14px] rounded-[12px]",
            lg: "h-[58px] px-9 text-[15px] rounded-[14px]"
        };

        return (
            <motion.button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center gap-[10px]",
                    "font-body font-semibold uppercase tracking-wide text-center",
                    "cursor-pointer outline-none relative bg-transparent",
                    "transition-[transform,filter] duration-150 antialiased select-none touch-none",
                    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                    variants[variant],
                    sizes[size],
                    fullWidth && "w-full max-w-full",
                    loading && "text-transparent!",
                    className
                )}
                disabled={disabled || loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsPressed(false);
                }}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onTouchStart={() => setIsPressed(true)}
                onTouchEnd={() => setIsPressed(false)}
                whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
                whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
                transition={springTransition}
                {...props}
            >
                {loading ? (
                    <motion.span
                        className={cn(
                            "absolute w-[22px] h-[22px] border-[3px] rounded-full",
                            (variant === "primary" || variant === "gold") ? "border-[#1a1a2e]/15 border-t-[#1a1a2e]" : "border-white/20 border-t-white"
                        )}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                ) : (
                    <>
                        {icon && (
                            <span className="flex items-center justify-center shrink-0 text-[1.2em]">
                                {icon}
                            </span>
                        )}
                        <span className="relative z-10">{children}</span>
                    </>
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
