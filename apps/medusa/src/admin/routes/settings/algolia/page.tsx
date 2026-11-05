import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, Text, toast } from "@medusajs/ui";
import { useMutation, QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "../../../lib/query-client";
import { sdk } from "../../../lib/sdk";

const AlgoliaPageContent = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sdk.client.fetch("/admin/algolia/sync", {
        method: "POST",
      }),
    onError: (err) => {
      toast.error("Could not start Algolia sync", {
        description: err.message || "Please try again later.",
      });
    },
    onSuccess: () => {
      toast.success("Algolia sync queued", {
        description:
          "Products are being indexed in the background. Check the Medusa logs for the final result.",
      });
    },
    retry: false,
  });

  const handleSync = () => {
    mutate();
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Algolia Sync</Heading>
      </div>
      <div className="px-6 py-8">
        <Text size="small" className="text-ui-fg-subtle mb-4">
          Sync runs in the background. The notification confirms the request was
          accepted, not that indexing has finished.
        </Text>
        <Button
          variant="primary"
          onClick={handleSync}
          isLoading={isPending}
          disabled={isPending}
        >
          Sync Data to Algolia
        </Button>
      </div>
    </Container>
  );
};

const AlgoliaPage = () => (
  <QueryClientProvider client={queryClient}>
    <AlgoliaPageContent />
  </QueryClientProvider>
);

export const config = defineRouteConfig({
  label: "Algolia",
});

export default AlgoliaPage;
