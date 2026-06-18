import * as React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiStar, 
  FiBarChart2,
  FiSettings,
  FiX,
  FiChevronLeft
} from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/Tooltip";
import { useAuth } from "@/hooks/useAuth";
import { ROLES, ROLE_LABELS } from "@/config/constants";
import { getChangePasswordPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: FiHome,
    roles: [ROLES.ADMIN]
  },
  {
    label: "Users",
    href: "/admin/users", 
    icon: FiUsers,
    roles: [ROLES.ADMIN]
  },
  {
    label: "Stores",
    href: "/admin/stores",
    icon: FiShoppingBag,
    roles: [ROLES.ADMIN]
  },
  {
    label: "Dashboard",
    href: "/user",
    icon: FiHome,
    roles: [ROLES.USER]
  },
  {
    label: "Browse Stores",
    href: "/user/stores",
    icon: FiShoppingBag,
    roles: [ROLES.USER]
  },
  {
    label: "Dashboard", 
    href: "/owner",
    icon: FiBarChart2,
    roles: [ROLES.STORE_OWNER]
  },
];

export function Sidebar({ isOpen = true, onClose, className }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(false);

  // Filter navigation items based on user role
  const visibleItems = React.useMemo(() => {
    return navigationItems.filter(item => 
      !item.roles || item.roles.includes(user?.role || '')
    );
  }, [user?.role]);

  const bottomItems: NavItem[] = React.useMemo(() => [
    {
      label: "Security",
      href: getChangePasswordPath(user?.role),
      icon: FiSettings,
    },
  ], [user?.role]);

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/user' || href === '/owner') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" }
  };

  return (
    <TooltipProvider>
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={cn(
          "flex flex-col h-screen bg-card border-r border-border",
          collapsed ? "w-16" : "w-64",
          "transition-all duration-200",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FiStar className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">RateStore</h1>
                <p className="text-xs text-muted-foreground">
                  {user?.role ? ROLE_LABELS[user.role as keyof typeof ROLE_LABELS] : 'Panel'}
                </p>
              </div>
            </motion.div>
          )}
          
          <div className="flex items-center gap-1">
            {/* Collapse toggle - desktop only */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCollapsed(!collapsed)}
                  className="hidden md:flex"
                >
                  <FiChevronLeft 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      collapsed && "rotate-180"
                    )} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </TooltipContent>
            </Tooltip>

            {/* Close button - mobile only */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="md:hidden"
            >
              <FiX className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-border">
          <div className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}>
            <Avatar name={user?.name} size="sm" />
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <Badge variant={user?.role as any} className="text-xs">
                  {user?.role}
                </Badge>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Tooltip key={item.href} delayDuration={collapsed ? 0 : 999}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.href}
                    onClick={() => onClose?.()}
                    className={cn(
                      "nav-link",
                      active && "nav-link-active",
                      collapsed && "justify-center px-3"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                    {!collapsed && item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom items */}
        <div className="p-4 border-t border-border space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Tooltip key={item.href} delayDuration={collapsed ? 0 : 999}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={item.href}
                    onClick={() => onClose?.()}
                    className={cn(
                      "nav-link",
                      active && "nav-link-active", 
                      collapsed && "justify-center px-3"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </NavLink>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}