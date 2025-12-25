"use client";

import { FC, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cardVariants, glassCardVariants, springTransition } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
    children: ReactNode;
    variant?: "glass" | "solid";
    glow?: "red" | "gold" | "purple" | "none";
    hoverable?: boolean;
}

export const Card: FC<CardProps> = ({
    children,
    variant = "glass",
    glow = "none",
    hoverable = false,
    className = "",
    ...props
}) => {
    const variants = {
        glass: "bg-surface-glass backdrop-blur-[20px] border border-surface-glass-border shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        solid: "bg-bg-dark-end border border-surface-glass-border"
    };

    const glows = {
        red: "shadow-[0_0_40px_var(--glow-red),0_8px_32px_rgba(0,0,0,0.4)]",
        gold: "shadow-[0_0_40px_var(--glow-gold),0_8px_32px_rgba(0,0,0,0.4)]",
        purple: "shadow-[0_0_40px_var(--glow-purple),0_8px_32px_rgba(0,0,0,0.4)]",
        none: ""
    };

    return (
        <motion.div
            className={cn(
                "rounded-lg p-lg transition-[transform,box-shadow] duration-normal",
                variants[variant],
                glow !== "none" && glows[glow],
                hoverable && "hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]",
                className
            )}
            variants={variant === "glass" ? glassCardVariants : cardVariants}
            initial="initial"
            animate="animate"
            whileHover={hoverable ? "hover" : undefined}
            transition={springTransition}
            {...props}
        >
            {children}
        </motion.div>
    );
};
