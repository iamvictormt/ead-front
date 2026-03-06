'use client';

import { useSidebar } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useEffect } from "react";

interface CollapsibleSidebarProps {
  onToggle: (isCollapsed: boolean) => void;
}

export function CollapsibleSidebar({ onToggle }: CollapsibleSidebarProps) {
  const { state } = useSidebar();

  useEffect(() => {
    onToggle(state === "collapsed");
  }, [state, onToggle]);

  return <AdminSidebar />;
}
