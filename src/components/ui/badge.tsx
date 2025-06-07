import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30",
  {
    variants: {
      variant: {
        default:
          "endel-gradient-subtle text-primary border border-primary/20 hover:border-primary/40",
        secondary:
          "bg-white/5 text-secondary-foreground border border-white/10 hover:bg-white/10",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        outline: "border border-white/20 text-foreground hover:bg-white/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
