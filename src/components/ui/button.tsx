import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap font-semibold transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",

                destructive:
                    "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl",

                outline:
                    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300",

                secondary:
                    "bg-slate-100 text-slate-800 hover:bg-slate-200",

                ghost:
                    "hover:bg-slate-100 text-slate-700",

                link:
                    "text-indigo-600 underline-offset-4 hover:underline",
            },

            size: {
                sm: "h-9 px-4 rounded-xl text-sm",
                default: "h-11 px-5 rounded-xl text-sm",
                lg: "h-12 px-8 rounded-xl text-sm font-bold",
                icon: "h-11 w-11 rounded-xl",
            },
        },

        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        return (
            <Comp
                ref={ref}
                className={cn(buttonVariants({ variant, size, className }))}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button, buttonVariants };