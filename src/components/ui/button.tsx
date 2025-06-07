import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-3xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "endel-gradient text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 active:scale-95",
        outline: "endel-button text-foreground hover:text-white",
        secondary: "bg-secondary/50 text-secondary-foreground endel-button",
        ghost: "hover:bg-white/5 hover:text-foreground transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
        endel: "endel-button text-foreground hover:endel-glow",
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 rounded-2xl px-6 text-xs",
        lg: "h-16 rounded-3xl px-12 text-base",
        icon: "h-12 w-12",
        xl: "h-24 w-24 rounded-full text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
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
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
