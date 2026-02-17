"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../lib/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>{children} </TooltipProvider>
    </QueryClientProvider>
  );
}
