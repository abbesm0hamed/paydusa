import { QueryProvider } from "./providers/query-provider"

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}
