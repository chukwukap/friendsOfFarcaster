import { FC } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GalleryButtonProps {
    onClick?: () => void;
    className?: string;
}

export const GalleryButton: FC<GalleryButtonProps> = ({ onClick, className }) => {
    return (
        <motion.button
            className={cn(
                "relative group w-full py-4 px-6 rounded-2xl overflow-hidden cursor-pointer",
                "border border-white/10 hover:border-accent-gold/50 transition-colors duration-300",
                "shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.2)]",
                className
            )}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Background Layers */}
            <div className="absolute inset-0 bg-bg-card opacity-90 backdrop-blur-md z-0" />

            {/* Animated Gradient border/glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-accent-gold/0 via-accent-gold/10 to-accent-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out z-0" />

            {/* Content */}
            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-gold/10 flex items-center justify-center border border-accent-gold/20 group-hover:border-accent-gold/50 transition-colors">
                        <span className="text-xl">🖼️</span>
                    </div>
                    <div className="flex flex-col items-start gap-0.5">
                        <span className="text-[15px] font-bold text-white group-hover:text-accent-gold transition-colors">
                            My Gallery
                        </span>
                        <span className="text-[11px] text-text-secondary group-hover:text-white/80 transition-colors">
                            View your collection
                        </span>
                    </div>
                </div>

                <div className="text-text-secondary group-hover:text-accent-gold transition-colors transform group-hover:translate-x-1 duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {/* Shine effect */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-accent-gold/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.button>
    );
};
