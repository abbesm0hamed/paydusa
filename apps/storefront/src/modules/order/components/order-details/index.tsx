'use client';

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { Button, toast } from "@medusajs/ui"
import { useState } from "react"
import { sdk } from "../../../../lib/config"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadInvoice = async () => {
    setIsDownloading(true)
    
    try {
      const response: Response = await sdk.client.fetch(
        `/store/orders/${order.id}/invoices`, 
        {
          method: "GET",
          headers: {
            "accept": "application/pdf",
          },
        }
      )

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `invoice-${order.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      setIsDownloading(false)
      toast.success("Invoice generated and downloaded successfully")
    } catch (error) {
      toast.error(`Failed to generate invoice: ${error}`)
      setIsDownloading(false)
    }

  }

  return (
    <div>
      <Text>
        We have sent the order confirmation details to{" "}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        Order date:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        Order number: <span data-testid="order-id">{order.display_id}</span>
      </Text>
      <Button 
        variant="secondary" 
        onClick={downloadInvoice} 
        disabled={isDownloading} 
        isLoading={isDownloading}
      >
        Download Invoice
      </Button>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              Order status:{" "}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              Payment status:{" "}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
