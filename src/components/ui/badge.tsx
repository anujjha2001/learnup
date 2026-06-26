"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground",

                secondary:
                    "bg-muted text-muted-foreground",

                outline:
                    "border border-border bg-background text-foreground",

                success:
                    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",

                warning:
                    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",

                danger:
                    "bg-red-500/10 text-red-600 dark:text-red-400",

                premium:
                    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm",

                glass:
                    "bg-white/60 text-foreground backdrop-blur-md border border-white/30 dark:bg-slate-900/40 dark:border-slate-700/40",
            },

            size: {
                default: "px-3 py-1 text-xs",
                sm: "px-2 py-0.5 text-[11px]",
                lg: "px-4 py-1.5 text-sm",
            },
        },

        defaultVariants: {
            variant: "secondary",
            size: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({
    className,
    variant,
    size,
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(badgeVariants({ variant, size }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };