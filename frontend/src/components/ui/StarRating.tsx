import * as React from "react";
import { FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showValue?: boolean;
  allowHalf?: boolean;
}

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ 
    value = 0, 
    onChange, 
    readonly = false, 
    size = "md", 
    className,
    showValue = false,
    allowHalf = false,
    ...props 
  }, ref) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
    
    const sizeClasses = {
      sm: "h-3 w-3",
      md: "h-4 w-4",
      lg: "h-5 w-5",
      xl: "h-6 w-6"
    };
    
    const handleClick = (rating: number) => {
      if (!readonly && onChange) {
        onChange(rating);
      }
    };
    
    const handleMouseEnter = (rating: number) => {
      if (!readonly) {
        setHoverValue(rating);
      }
    };
    
    const handleMouseLeave = () => {
      if (!readonly) {
        setHoverValue(null);
      }
    };
    
    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
      if (readonly) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          const nextIndex = Math.min(index + 1, 4);
          setFocusedIndex(nextIndex);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          const prevIndex = Math.max(index - 1, 0);
          setFocusedIndex(prevIndex);
          break;
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleClick(index + 1);
          break;
        case 'Home':
          event.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setFocusedIndex(4);
          break;
      }
    };
    
    const getRatingValue = (index: number): number => {
      const displayValue = hoverValue !== null ? hoverValue : value;
      
      if (allowHalf) {
        const starValue = index + 1;
        if (displayValue >= starValue) return 1;
        if (displayValue >= starValue - 0.5) return 0.5;
        return 0;
      } else {
        return displayValue > index ? 1 : 0;
      }
    };
    
    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center gap-0.5",
          !readonly && "cursor-pointer",
          className
        )}
        role={readonly ? "img" : "radiogroup"}
        aria-label={readonly ? `Rating: ${value} out of 5 stars` : "Rate this item"}
        {...props}
      >
        {Array.from({ length: 5 }, (_, index) => {
          const starRating = getRatingValue(index);
          const isFocused = focusedIndex === index;
          
          return (
            <button
              key={index}
              type="button"
              className={cn(
                "relative transition-all duration-200 rounded-sm",
                !readonly && "hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                readonly && "cursor-default",
                isFocused && "ring-2 ring-primary ring-offset-1"
              )}
              onClick={() => handleClick(index + 1)}
              onMouseEnter={() => handleMouseEnter(index + 1)}
              onMouseLeave={handleMouseLeave}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
              disabled={readonly}
              tabIndex={readonly ? -1 : 0}
              role={readonly ? "presentation" : "radio"}
              aria-checked={readonly ? undefined : value === index + 1}
              aria-label={readonly ? undefined : `Rate ${index + 1} star${index + 1 !== 1 ? 's' : ''}`}
            >
              <FiStar 
                className={cn(
                  sizeClasses[size],
                  "transition-all duration-200",
                  starRating > 0 && "text-yellow-400 fill-yellow-400",
                  starRating === 0 && "text-surface-300 dark:text-surface-600"
                )}
                fill={starRating > 0 ? "currentColor" : "none"}
              />
              
              {/* Half star overlay */}
              {allowHalf && starRating === 0.5 && (
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <FiStar 
                    className={cn(
                      sizeClasses[size],
                      "text-yellow-400 fill-yellow-400"
                    )}
                    fill="currentColor"
                  />
                </div>
              )}
            </button>
          );
        })}
        
        {showValue && (
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            {value.toFixed(1)}
          </span>
        )}
      </div>
    );
  }
);

StarRating.displayName = "StarRating";

export { StarRating };