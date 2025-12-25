"use client";

import { FC, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cardVariants, glassCardVariants, springTransition } from "@/lib/animations";
import styles from "./Card.module.css";

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
    const classes = [
        styles.card,
        styles[variant],
        glow !== "none" ? styles[`glow-${glow}`] : "",
        hoverable ? styles.hoverable : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <motion.div
            className={classes}
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
