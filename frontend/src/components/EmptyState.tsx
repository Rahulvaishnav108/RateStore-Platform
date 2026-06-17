import * as React from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      {icon && (
        <div className="mb-4 text-4xl text-muted-foreground/50">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Predefined empty states for common scenarios
export function NoDataEmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      icon="📊"
      title="No data available"
      description="There's no data to display at the moment."
      action={onRefresh ? { label: "Refresh", onClick: onRefresh } : undefined}
    />
  );
}

export function NoResultsEmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      icon="🔍"
      title="No results found"
      description="Try adjusting your search criteria or filters."
      action={onClear ? { label: "Clear filters", onClick: onClear } : undefined}
    />
  );
}

export function NoUsersEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon="👥"
      title="No users yet"
      description="Get started by creating your first user account."
      action={onCreate ? { label: "Add User", onClick: onCreate } : undefined}
    />
  );
}

export function NoStoresEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon="🏪"
      title="No stores yet"
      description="Add stores to start collecting ratings and reviews."
      action={onCreate ? { label: "Add Store", onClick: onCreate } : undefined}
    />
  );
}

export function NoRatingsEmptyState() {
  return (
    <EmptyState
      icon="⭐"
      title="No ratings yet"
      description="Ratings will appear here once customers start reviewing stores."
    />
  );
}