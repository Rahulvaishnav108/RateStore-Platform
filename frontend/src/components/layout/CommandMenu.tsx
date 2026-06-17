import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { 
  FiHome, 
  FiUsers, 
  FiShoppingBag, 
  FiSearch,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiMonitor
} from "react-icons/fi";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { ROLES } from "@/config/constants";
import { cn } from "@/lib/utils";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
  action: () => void;
  roles?: string[];
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const [search, setSearch] = React.useState("");

  // Navigation commands
  const navigationCommands: CommandItem[] = React.useMemo(() => [
    {
      id: "nav-admin-dashboard",
      label: "Admin Dashboard",
      description: "View admin analytics and stats",
      icon: FiHome,
      keywords: ["dashboard", "admin", "home"],
      action: () => navigate("/admin"),
      roles: [ROLES.ADMIN]
    },
    {
      id: "nav-users",
      label: "Manage Users",
      description: "View and manage all users",
      icon: FiUsers,
      keywords: ["users", "manage", "admin"],
      action: () => navigate("/admin/users"),
      roles: [ROLES.ADMIN]
    },
    {
      id: "nav-stores",
      label: "Manage Stores", 
      description: "View and manage all stores",
      icon: FiShoppingBag,
      keywords: ["stores", "manage", "admin"],
      action: () => navigate("/admin/stores"),
      roles: [ROLES.ADMIN]
    },
    {
      id: "nav-user-dashboard",
      label: "User Dashboard",
      description: "View your dashboard",
      icon: FiHome,
      keywords: ["dashboard", "user", "home"],
      action: () => navigate("/user"),
      roles: [ROLES.USER]
    },
    {
      id: "nav-browse-stores",
      label: "Browse Stores",
      description: "Browse and rate stores",
      icon: FiShoppingBag,
      keywords: ["stores", "browse", "rate"],
      action: () => navigate("/user/stores"),
      roles: [ROLES.USER]
    },
    {
      id: "nav-owner-dashboard",
      label: "Owner Dashboard",
      description: "View your store analytics",
      icon: FiHome,
      keywords: ["dashboard", "owner", "home"],
      action: () => navigate("/owner"),
      roles: [ROLES.STORE_OWNER]
    },
  ], [navigate]);

  // Theme commands
  const themeCommands: CommandItem[] = [
    {
      id: "theme-light",
      label: "Light Theme",
      description: "Switch to light mode",
      icon: FiSun,
      keywords: ["light", "theme", "mode"],
      action: () => setTheme('light')
    },
    {
      id: "theme-dark", 
      label: "Dark Theme",
      description: "Switch to dark mode",
      icon: FiMoon,
      keywords: ["dark", "theme", "mode"],
      action: () => setTheme('dark')
    },
    {
      id: "theme-system",
      label: "System Theme",
      description: "Use system preference",
      icon: FiMonitor,
      keywords: ["system", "theme", "mode", "auto"],
      action: () => setTheme('system')
    },
  ];

  // Action commands
  const actionCommands: CommandItem[] = [
    {
      id: "action-settings",
      label: "Settings",
      description: "Open settings page",
      icon: FiSettings,
      keywords: ["settings", "preferences", "config"],
      action: () => navigate("/settings")
    },
    {
      id: "action-logout",
      label: "Logout",
      description: "Sign out of your account",
      icon: FiLogOut,
      keywords: ["logout", "signout", "exit"],
      action: () => {
        logout();
        onOpenChange(false);
      }
    },
  ];

  // Filter commands based on user role
  const visibleNavigationCommands = navigationCommands.filter(command => 
    !command.roles || command.roles.includes(user?.role || '')
  );

  const allCommands = [
    ...visibleNavigationCommands,
    ...themeCommands,
    ...actionCommands
  ];

  // Filter commands based on search
  const filteredCommands = React.useMemo(() => {
    if (!search) return allCommands;
    
    const searchLower = search.toLowerCase();
    return allCommands.filter(command => 
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some(keyword => keyword.toLowerCase().includes(searchLower))
    );
  }, [allCommands, search]);

  const handleSelect = (command: CommandItem) => {
    command.action();
    onOpenChange(false);
    setSearch("");
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-[640px]">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
            <FiSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Type a command or search..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>
            
            {/* Navigation */}
            {visibleNavigationCommands.length > 0 && (
              <Command.Group heading="Navigation">
                {visibleNavigationCommands
                  .filter(command => filteredCommands.includes(command))
                  .map((command) => {
                    const Icon = command.icon;
                    return (
                      <Command.Item
                        key={command.id}
                        value={command.label}
                        onSelect={() => handleSelect(command)}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                          "aria-selected:bg-accent aria-selected:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <div className="flex flex-col">
                          <span>{command.label}</span>
                          {command.description && (
                            <span className="text-xs text-muted-foreground">
                              {command.description}
                            </span>
                          )}
                        </div>
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            )}

            {/* Theme */}
            <Command.Group heading="Theme">
              {themeCommands
                .filter(command => filteredCommands.includes(command))
                .map((command) => {
                  const Icon = command.icon;
                  return (
                    <Command.Item
                      key={command.id}
                      value={command.label}
                      onSelect={() => handleSelect(command)}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{command.label}</span>
                        {command.description && (
                          <span className="text-xs text-muted-foreground">
                            {command.description}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  );
                })}
            </Command.Group>

            {/* Actions */}
            <Command.Group heading="Actions">
              {actionCommands
                .filter(command => filteredCommands.includes(command))
                .map((command) => {
                  const Icon = command.icon;
                  return (
                    <Command.Item
                      key={command.id}
                      value={command.label}
                      onSelect={() => handleSelect(command)}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                        "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{command.label}</span>
                        {command.description && (
                          <span className="text-xs text-muted-foreground">
                            {command.description}
                          </span>
                        )}
                      </div>
                    </Command.Item>
                  );
                })}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}