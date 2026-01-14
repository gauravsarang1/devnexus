import React from "react";
import { motion } from "framer-motion";

const shimmer = {
    initial: { backgroundPosition: "200% 0" },
    animate: {
        backgroundPosition: "-200% 0",
        transition: {
            repeat: Infinity,
            duration: 1.4,
            ease: "linear" as const,
        },
    },
};

const SkeletonItem = () => (
    <div className="p-4 rounded-[24px] flex gap-4 border border-slate-100">
        {/* Icon */}
        <motion.div
            variants={shimmer}
            initial="initial"
            animate="animate"
            className="w-11 h-11 rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
        />

        {/* Content */}
        <div className="flex-grow space-y-2">
            <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="h-4 w-3/4 rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
            />
            <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="h-3 w-full rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
            />
            <motion.div
                variants={shimmer}
                initial="initial"
                animate="animate"
                className="h-3 w-2/3 rounded bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%]"
            />
        </div>
    </div>
);

const NotificationDrawerSkeleton: React.FC = () => {
    return (
        <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white shadow-2xl z-[70] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                <div className="h-6 w-32 bg-slate-200 rounded" />
                <div className="h-6 w-20 bg-slate-100 rounded" />
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto px-3 py-4 space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonItem key={i} />
                ))}
            </div>
        </div>
    );
};

export default NotificationDrawerSkeleton;
