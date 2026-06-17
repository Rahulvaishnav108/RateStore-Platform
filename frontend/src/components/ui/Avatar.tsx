import * as React from "react";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, name, size = "md", ...props }, ref) => {
    const [imgError, setImgError] = React.useState(false);
    
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm", 
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg"
    };

    const displayFallback = fallback || (name ? getInitials(name) : "?");
    const colorClass = name ? getAvatarColor(name) : "bg-surface-200";

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imgError ? (
          <img
            className="aspect-square h-full w-full object-cover"
            src={src}
            alt={alt || name}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={cn(
            "flex h-full w-full items-center justify-center font-medium text-white",
            colorClass
          )}>
            {displayFallback}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };