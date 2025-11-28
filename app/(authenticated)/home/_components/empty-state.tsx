"use client";

import React from "react";

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="space-y-2 rounded-2xl border border-dashed border-border/60 px-6 py-8 text-center">
      <Icon className="mx-auto h-6 w-6 text-muted-foreground/60" />
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
