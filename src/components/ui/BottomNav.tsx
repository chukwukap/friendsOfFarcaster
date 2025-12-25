"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLORS } from "@/lib/constants";

export type NavTab = "home" | "gallery" | "profile";

interface BottomNavProps {
    activeTab: NavTab;
    onTabChange: (tab: NavTab) => void;
    className?: string;
}

interface NavItem {
    id: NavTab;
    label: string;
    icon: string;
    activeIcon: string;
}

const navItems: NavItem[] = [
    {
        id: "home",
        label: "Create",
        icon: "✨",
        activeIcon: "🎄",
    },
    {
        id: "gallery",
        label: "Gallery",
        icon: "🖼️",
        activeIcon: "🖼️",
    },
    {
        id: "profile",
        label: "Profile",
        icon: "👤",
        activeIcon: "🎅",
    },
];

/**
 * Premium mobile bottom navigation with glassmorphic styling
 * Features smooth animations and haptic-style feedback
 */
export const BottomNav: FC<BottomNavProps> = ({
    activeTab,
    onTabChange,
    className,
}) => {
    return (
        <motion.nav
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50",
                "pb-[env(safe-area-inset-bottom,0px)]",
                className
            )}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.2 }}
        >
            {/* Glassmorphic background */}
            <div className="mx-4 mb-4 rounded-2xl overflow-hidden">
                <div
                    className="backdrop-blur-xl border border-white/10"
                    style={{
                        background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                        boxShadow: "0 -4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                >
                    <div className="flex items-center justify-around py-2 px-2">
                        {navItems.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => onTabChange(item.id)}
                                    className={cn(
                                        "relative flex flex-col items-center justify-center",
                                        "w-[72px] h-[56px] rounded-xl transition-colors duration-200",
                                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                                        isActive ? "bg-white/10" : "hover:bg-white/5"
                                    )}
                                    whileTap={{ scale: 0.92 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    {/* Active indicator glow */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-xl"
                                            layoutId="activeTab"
                                            style={{
                                                background: `linear-gradient(180deg, ${COLORS.primaryRed}20 0%, transparent 100%)`,
                                                boxShadow: `0 0 20px ${COLORS.glowRed}`,
                                            }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <motion.span
                                        className="text-[22px] relative z-10"
                                        animate={{
                                            scale: isActive ? 1.15 : 1,
                                            y: isActive ? -2 : 0,
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        {isActive ? item.activeIcon : item.icon}
                                    </motion.span>

                                    {/* Label */}
                                    <motion.span
                                        className={cn(
                                            "text-[10px] font-medium relative z-10 mt-0.5",
                                            isActive ? "text-white" : "text-white/50"
                                        )}
                                        animate={{ opacity: isActive ? 1 : 0.6 }}
                                    >
                                        {item.label}
                                    </motion.span>

                                    {/* Active dot indicator */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                                            style={{ backgroundColor: COLORS.primaryRed }}
                                            layoutId="activeDot"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default BottomNav;
