import * as React from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { FormField } from "./FormField";
import { cn } from "@/lib/utils";

interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  showClear?: boolean;
}

const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ 
    onSearch,
    onClear,
    debounceMs = 300,
    showClear = true,
    value,
    className,
    ...props 
  }, ref) => {
    const [query, setQuery] = React.useState(String(value || ""));
    const timeoutRef = React.useRef<NodeJS.Timeout>();
    
    React.useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        onSearch?.(query);
      }, debounceMs);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [query, debounceMs, onSearch]);
    
    React.useEffect(() => {
      setQuery(String(value || ""));
    }, [value]);
    
    const handleClear = () => {
      setQuery("");
      onClear?.();
      onSearch?.("");
    };
    
    return (
      <FormField
        ref={ref}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        startIcon={<FiSearch className="h-4 w-4" />}
        endIcon={
          showClear && query ? (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleClear}
              tabIndex={-1}
            >
              <FiX className="h-4 w-4" />
            </button>
          ) : undefined
        }
        className={className}
        {...props}
      />
    );
  }
);
SearchField.displayName = "SearchField";

export { SearchField };