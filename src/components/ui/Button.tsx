"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { buttonVariants, primaryButtonVariants, goldButtonVariants, springTransition } from "@/lib/animations";
import styles from "./Button.module.css";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
    children?: React.ReactNode;
    variant?: "primary" | "secondary" | "gold" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

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
        const classes = [
            styles.button,
            styles[variant],
            styles[size],
            fullWidth ? styles.fullWidth : "",
            loading ? styles.loading : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");

        // Select animation variants based on button type
        const getVariants = () => {
            switch (variant) {
                case "primary":
                    return primaryButtonVariants;
                case "gold":
                    return goldButtonVariants;
                default:
                    return buttonVariants;
            }
        };

        return (
            <motion.button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                variants={getVariants()}
                initial="initial"
                whileHover={!disabled && !loading ? "hover" : undefined}
                whileTap={!disabled && !loading ? "tap" : undefined}
                animate={disabled ? "disabled" : "initial"}
                transition={springTransition}
                {...props}
            >
                {loading ? (
                    <motion.span
                        className={styles.spinner}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                ) : (
                    <>
                        {icon && (
                            <motion.span
                                className={styles.icon}
                                initial={{ scale: 1 }}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={springTransition}
                            >
                                {icon}
                            </motion.span>
                        )}
                        {children}
                    </>
                )}
            </motion.button>
        );
    }
);

Button.displayName = "Button";
