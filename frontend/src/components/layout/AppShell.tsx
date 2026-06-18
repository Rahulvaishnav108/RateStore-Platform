import * as React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { CommandMenu } from "./CommandMenu";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children?: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  );

  React.useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleChange = () => setIsDesktop(media.matches);
    handleChange();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K to open command menu
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen(true);
      }
      // Escape to close sidebar on mobile
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  if (!user) {
    return children || <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && !isDesktop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isDesktop || sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        className="fixed inset-y-0 left-0 z-50"
      />

      {/* Main content area */}
      <div className="flex flex-col md:ml-64">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          onCommandClick={() => setCommandOpen(true)}
          className="sticky top-0 z-30"
        />

        {/* Page content */}
        <main 
          className={cn(
            "flex-1 transition-all duration-200",
            "container-padding py-6",
            "min-h-[calc(100vh-4rem)]" // Account for navbar height
          )}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0.0, 0.2, 1] // Custom easing
            }}
          >
            {children || <Outlet />}
          </motion.div>
        </main>
      </div>

      {/* Command menu */}
      <CommandMenu 
        open={commandOpen} 
        onOpenChange={setCommandOpen}
      />
    </div>
  );
}
