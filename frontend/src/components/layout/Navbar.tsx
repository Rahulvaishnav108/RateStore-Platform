import { useNavigate } from "react-router-dom";
import { 
  FiMenu, 
  FiSearch, 
  FiBell, 
  FiMoon, 
  FiSun, 
  FiMonitor,
  FiSettings,
  FiLogOut,
  FiCommand
} from "react-icons/fi";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getChangePasswordPath } from "@/lib/routes";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick?: () => void;
  onCommandClick?: () => void;
  className?: string;
}

export function Navbar({ onMenuClick, onCommandClick, className }: NavbarProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const themeIcons = {
    light: FiSun,
    dark: FiMoon,
    system: FiMonitor,
  };
  
  const ThemeIcon = themeIcons[theme];

  return (
    <header className={cn(
      "flex items-center justify-between h-16 px-6 bg-background/95 backdrop-blur-sm border-b border-border",
      className
    )}>
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </Button>

        {/* Search trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={onCommandClick}
          className="hidden sm:flex items-center gap-2 min-w-[200px] justify-start text-muted-foreground"
        >
          <FiSearch className="h-4 w-4" />
          <span>Search...</span>
          <div className="ml-auto flex items-center gap-0.5">
            <kbd className="pointer-events-none select-none rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              <FiCommand className="h-3 w-3" />
            </kbd>
            <kbd className="pointer-events-none select-none rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium">
              K
            </kbd>
          </div>
        </Button>

        {/* Mobile search button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onCommandClick}
          className="sm:hidden"
        >
          <FiSearch className="h-5 w-5" />
        </Button>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="sm">
              <ThemeIcon className="h-5 w-5" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[160px] bg-popover border border-border rounded-lg shadow-lg p-1 z-50"
              align="end"
              sideOffset={5}
            >
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent focus:bg-accent outline-none"
                onClick={() => setTheme('light')}
              >
                <FiSun className="h-4 w-4" />
                Light
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent focus:bg-accent outline-none"
                onClick={() => setTheme('dark')}
              >
                <FiMoon className="h-4 w-4" />
                Dark
              </DropdownMenu.Item>
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent focus:bg-accent outline-none"
                onClick={() => setTheme('system')}
              >
                <FiMonitor className="h-4 w-4" />
                System
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative">
          <FiBell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
          >
            3
          </Badge>
        </Button>

        {/* User menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="sm" className="relative p-1">
              <Avatar 
                name={user?.name}
                size="sm"
                className="h-8 w-8"
              />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-popover border border-border rounded-lg shadow-lg p-1 z-50"
              align="end"
              sideOffset={5}
            >
              {/* User info */}
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant={user?.role as any} className="mt-1">
                  {user?.role}
                </Badge>
              </div>

              {/* Menu items */}
              <DropdownMenu.Item
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent focus:bg-accent outline-none"
                onClick={() => navigate(getChangePasswordPath(user?.role))}
              >
                <FiSettings className="h-4 w-4" />
                Change Password
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-border my-1" />

              <DropdownMenu.Item 
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent focus:bg-accent outline-none text-destructive"
                onClick={handleLogout}
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
