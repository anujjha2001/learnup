import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            `
      rounded-3xl
      border
      border-slate-200/60
      bg-white/80
      backdrop-blur-xl
      shadow-[0_4px_24px_-1px_rgba(0,0,0,0.05)]
      dark:bg-slate-900/70
      dark:border-slate-700/50
      transition-all
      `,
            className
        )}
        {...props}
    />
));

Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-8 pt-8 pb-4", className)}
        {...props}
    />
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            `
      text-xl
      font-bold
      tracking-tight
      text-slate-900
      dark:text-white
      `,
            className
        )}
        {...props}
    />
));

CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("px-8 pb-8", className)}
        {...props}
    />
));

CardContent.displayName = "CardContent";

export {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
};