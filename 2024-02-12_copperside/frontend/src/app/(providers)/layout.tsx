"use client";

import queryClient from "@helpers/state";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

interface ProvidersLayoutProps {
  children: ReactNode;
}

export default function ProvidersLayout({ children }: ProvidersLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
