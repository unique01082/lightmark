"use client";

import { DirectusService } from "@/lib/directus";
import { useRequest } from "ahooks";
import { createContext, ReactNode, use, useContext } from "react";

type SharedState = {
  dataType: any;
  refreshDataType: () => ReturnType<typeof DirectusService.getDataType>;
};

const SharedStateContext = createContext<SharedState | undefined>(undefined);

export function usePageData() {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error("usePageData must be used within SharedStateProvider");
  }
  return context;
}

// Layout component that provides the shared state
export default function Layout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}) {
  const { slug } = use(params);

  const { data: dataType, refreshAsync: refreshDataType } = useRequest(
    DirectusService.getDataType,
    {
      defaultParams: [slug],
    }
  );

  if (!dataType) {
    return <div>Loading...</div>; // or a loading spinner
  }

  return (
    <SharedStateContext.Provider value={{ dataType, refreshDataType }}>
      {children}
    </SharedStateContext.Provider>
  );
}
