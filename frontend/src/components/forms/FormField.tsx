import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/Input";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  showCharCount?: boolean;
  maxLength?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ 
    className,
    label,
    hint,
    error,
    showCharCount,
    maxLength,
    startIcon,
    endIcon,
    id,
    value,
    ...props 
  }, ref) => {
    const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
    const currentLength = typeof value === 'string' ? value.length : 0;
    
    return (
      <div className={cn("space-y-2", className)}>
        {(label || (showCharCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {label && (
              <label 
                htmlFor={fieldId}
                className="text-sm font-medium text-foreground"
              >
                {label}
                {props.required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}
            {showCharCount && maxLength && (
              <span className={cn(
                "text-xs",
                currentLength > maxLength ? "text-destructive" : "text-muted-foreground"
              )}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {startIcon}
            </div>
          )}
          
          <Input
            ref={ref}
            id={fieldId}
            value={value}
            className={cn(
              startIcon && "pl-10",
              endIcon && "pr-10",
              error && "border-destructive focus-visible:ring-destructive"
            )}
            aria-describedby={
              error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
            }
            aria-invalid={error ? "true" : "false"}
            maxLength={maxLength}
            {...props}
          />
          
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
        
        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )}
        
        {error && (
          <p 
            id={`${fieldId}-error`} 
            className="text-xs text-destructive flex items-center gap-1"
            role="alert"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);
FormField.displayName = "FormField";

export { FormField };