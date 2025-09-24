import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"
import { queryClient } from "../lib/query-client"

interface QueryProviderProps {
  children: ReactNode
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
