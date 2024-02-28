"use client";

import store from "@helpers/store/store";
import { ReactNode } from "react";
import { Provider as ReduxProvider } from "react-redux";

interface ProvidersLayoutProps {
  children: ReactNode;
}

export default function ProvidersLayout({ children }: ProvidersLayoutProps) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
