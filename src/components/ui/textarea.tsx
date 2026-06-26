"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    // Base
                    "flex min-h-[120px] w-full resize-none",

                    // Stitch styling
                    "rounded-2xl border border-slate-200/80",
                    "bg-white/90 backdrop-blur-sm",

                    // Typography
                    "px-4 py-3 text-sm text-slate-700",
                    "placeholder:text-slate-400",

                    // Focus
                    "transition-all duration-300",
                    "focus:border-indigo-500",
                    "focus:ring-4 focus:ring-indigo-500/10",
                    "focus:outline-none",

                    // Disabled
                    "disabled:cursor-not-allowed disabled:opacity-50",

                    // Dark mode
                    "dark:border-slate-700",
                    "dark:bg-slate-900/80",
                    "dark:text-slate-100",
                    "dark:placeholder:text-slate-500",
                    "dark:focus:border-indigo-400",
                    "dark:focus:ring-indigo-400/10",

                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };