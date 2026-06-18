import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { Spinner } from "@/components/ui/Spinner";

interface LoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export function LoadingScreen({ message = "Loading...", showLogo = true }: LoadingScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center space-y-6"
      >
        {showLogo && (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
              <FiStar className="w-8 h-8 text-primary-foreground" />
            </div>
          </motion.div>
        )}
        
        <div className="space-y-3">
          <Spinner size="lg" className="mx-auto text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            {message}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Inline loading component for smaller areas
export function InlineLoader({ message, className }: { message?: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center space-y-3">
        <Spinner className="mx-auto text-primary" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
