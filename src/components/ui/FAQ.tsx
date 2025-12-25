"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Inline ChevronDown component (no lucide-react dependency)
const ChevronDown: FC<{ className?: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "What is the eligibility criteria for the airdrop?",
        answer: "Eligibility includes: (1) People who have checked out our other mini apps, (2) People who have used our other mini apps, and (3) People who have paid to generate their Farcaster Friends – Christmas Edition.",
    },
    {
        question: "How much does it cost?",
        answer: "$1 to generate your personalized Farcaster Friends portrait.",
    },
    {
        question: "What is Waffles?",
        answer: "Waffles is our pattern-matching tournament mini app. Generate your FOF to earn +1,000 bonus points on the Waffles leaderboard!",
    },
    {
        question: "Can I share my FOF on Farcaster?",
        answer: "Yes! After generating your FOF, you can share it directly to Farcaster.",
    },
];

interface FAQItemCardProps {
    item: FAQItem;
    isOpen: boolean;
    onToggle: () => void;
}

const FAQItemCard: FC<FAQItemCardProps> = ({ item, isOpen, onToggle }) => {
    return (
        <motion.div
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
            initial={false}
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 text-left"
            >
                <span className="text-[14px] font-medium text-white pr-4">
                    {item.question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                >
                    <ChevronDown className="w-5 h-5 text-accent-gold" />
                </motion.div>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4">
                            <p className="text-[13px] text-text-secondary leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const FAQ: FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <motion.section
            className="w-full flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <h2 className="text-[16px] font-bold text-white text-center mb-1">
                Frequently Asked Questions
            </h2>
            <div className="flex flex-col gap-2">
                {faqItems.map((item, index) => (
                    <FAQItemCard
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                    />
                ))}
            </div>
        </motion.section>
    );
};
