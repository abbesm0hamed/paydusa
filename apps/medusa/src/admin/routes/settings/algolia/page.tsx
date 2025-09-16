import { Container, Heading, Button, toast } from "@medusajs/ui"
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { sdk } from "../../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const AlgoliaPageContent = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => 
      sdk.client.fetch("/admin/algolia/sync", {
        method: "POST",
      }),
    onSuccess: () => {
      toast.success("Successfully triggered data sync to Algolia") 
    },
    onError: (err) => {
      console.error(err)
      toast.error("Failed to sync data to Algolia") 
    },
  })

  const handleSync = () => {
    mutate()
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Algolia Sync</Heading>
      </div>
      <div className="px-6 py-8">
        <Button 
          variant="primary"
          onClick={handleSync}
          isLoading={isPending}
        >
          Sync Data to Algolia
        </Button>
      </div>
    </Container>
  )
}

const AlgoliaPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlgoliaPageContent />
    </QueryClientProvider>
  )
}

export const config = defineRouteConfig({
  label: "Algolia",
})

export default AlgoliaPage
