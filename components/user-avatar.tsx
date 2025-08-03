import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("relative w-full h-full", {
  variants: {
    size: {
      xs: "h-6 w-6 text-[0.625rem]",
      sm: "h-8 w-8 text-xs",
      md: "h-12 w-12 text-sm",
      lg: "h-16 w-16 text-base",
      xl: "h-20 w-20 text-lg",
      "2xl": "h-24 w-24 text-xl",
      "3xl": "h-32 w-32 text-2xl",
    },
    rounded: {
      true: "rounded-full",
      false: "rounded-lg",
    },
    ringed: {
      true: "border border-2",
      false: "",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: true,
    ringed: true,
  },
});

// Skeleton style variants (for loading state)
const skeletonVariants = cva("w-full h-full", {
  variants: {
    size: {
      xs: "h-4 w-4",
      sm: "h-8 w-8",
      md: "h-12 w-12",
      lg: "h-16 w-16",
      xl: "h-20 w-20",
      "2xl": "h-24 w-24",
      "3xl": "h-32 w-32",
    },
    rounded: {
      true: "rounded-full",
      false: "rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
    rounded: true,
  },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  name?: string;
  image?: string;
  className?: string;
  loading?: boolean;
}

export function UserAvatar({
  name,
  image,
  className,
  loading = false,
  size,
  rounded,
  ringed,
}: UserAvatarProps) {
  const avatarClass = avatarVariants({ size, rounded, ringed });
  const skeletonClass = skeletonVariants({ size, rounded });

  return (
    <div className={cn(className)}>
      {loading ? (
        <Skeleton className={cn(skeletonClass)} />
      ) : (
        <Avatar className={cn(avatarClass)}>
          <AvatarImage src={image} alt={name} />
          <AvatarFallback
            className={cn(rounded ? "rounded-full" : "rounded-lg", "uppercase")}
          >
            {name?.split(" ")?.[0]?.slice(0, 2) || name?.split(" ")?.[0]}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
