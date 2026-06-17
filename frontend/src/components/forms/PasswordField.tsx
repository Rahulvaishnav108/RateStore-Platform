import * as React from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";
import { FormField } from "./FormField";
import { cn } from "@/lib/utils";

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  showStrength?: boolean;
  showToggle?: boolean;
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
  if (!password) return { score: 0, label: "", color: "" };
  
  let score = 0;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password)
  ];
  
  score = checks.filter(Boolean).length;
  
  const strength = {
    0: { label: "Too weak", color: "bg-red-500" },
    1: { label: "Too weak", color: "bg-red-500" },
    2: { label: "Weak", color: "bg-orange-500" },
    3: { label: "Fair", color: "bg-yellow-500" },
    4: { label: "Good", color: "bg-blue-500" },
    5: { label: "Strong", color: "bg-green-500" }
  };
  
  return { score, ...strength[score as keyof typeof strength] };
};

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ 
    label = "Password",
    hint,
    error,
    showStrength = false,
    showToggle = true,
    value,
    className,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const strength = showStrength ? getPasswordStrength(String(value || "")) : null;
    
    return (
      <div className={className}>
        <FormField
          ref={ref}
          type={isVisible ? "text" : "password"}
          label={label}
          hint={hint}
          error={error}
          value={value}
          startIcon={<FiLock className="h-4 w-4" />}
          endIcon={
            showToggle ? (
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsVisible(!isVisible)}
                tabIndex={-1}
              >
                {isVisible ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            ) : undefined
          }
          {...props}
        />
        
        {showStrength && value && strength && (
          <div className="mt-2 space-y-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 rounded-full flex-1 transition-colors",
                    i < strength.score ? strength.color : "bg-muted"
                  )}
                />
              ))}
            </div>
            {strength.score > 0 && (
              <p className="text-xs text-muted-foreground">
                Password strength: <span className="font-medium">{strength.label}</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";

export { PasswordField };