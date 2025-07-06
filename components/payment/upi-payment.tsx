"use client"

import { useState } from "react"
import { Smartphone, QrCode, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/toast-provider"
import type { PaymentDetails } from "@/contexts/payment-context"

interface UPIPaymentProps {
  paymentDetails: PaymentDetails
  onSubmit: (data: any) => void
  isProcessing: boolean
}

export function UPIPayment({ paymentDetails, onSubmit, isProcessing }: UPIPaymentProps) {
  const [upiId, setUpiId] = useState("")
  const [selectedApp, setSelectedApp] = useState("")
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

  const upiApps = [
    { id: "gpay", name: "Google Pay", icon: "🟢" },
    { id: "phonepe", name: "PhonePe", icon: "🟣" },
    { id: "paytm", name: "Paytm", icon: "🔵" },
    { id: "bhim", name: "BHIM UPI", icon: "🟠" },
    { id: "amazonpay", name: "Amazon Pay", icon: "🟡" },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleUpiIdSubmit = () => {
    if (!upiId.trim()) {
      addToast({
        type: "error",
        title: "UPI ID Required",
        description: "Please enter your UPI ID",
      })
      return
    }

    if (!upiId.includes("@")) {
      addToast({
        type: "error",
        title: "Invalid UPI ID",
        description: "Please enter a valid UPI ID (e.g., user@paytm)",
      })
      return
    }

    onSubmit({ upiId, method: "upi_id" })
  }

  const handleAppPayment = (appId: string) => {
    setSelectedApp(appId)
    onSubmit({ app: appId, method: "upi_app" })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    addToast({
      type: "success",
      title: "Copied!",
      description: "UPI ID copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const qrCodeData = `upi://pay?pa=merchant@paytm&pn=EliteCart&am=${paymentDetails.amount}&cu=INR&tn=Payment for Order ${paymentDetails.orderId}`

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upi-id" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upi-id">UPI ID</TabsTrigger>
          <TabsTrigger value="apps">UPI Apps</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
        </TabsList>

        <TabsContent value="upi-id" className="space-y-4">
          <div>
            <Label htmlFor="upiId">Enter your UPI ID</Label>
            <Input
              id="upiId"
              placeholder="yourname@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Example: 9876543210@paytm, user@googlepay, name@phonepe</p>
          </div>

          <Button
            onClick={handleUpiIdSubmit}
            disabled={isProcessing || !upiId.trim()}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {isProcessing ? "Processing..." : `Pay ${formatPrice(paymentDetails.amount)}`}
          </Button>
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {upiApps.map((app) => (
              <Card
                key={app.id}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedApp === app.id ? "ring-2 ring-green-500" : ""
                }`}
                onClick={() => !isProcessing && handleAppPayment(app.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{app.icon}</div>
                  <p className="font-medium text-sm">{app.name}</p>
                  {selectedApp === app.id && isProcessing && (
                    <Badge className="mt-2 bg-green-100 text-green-800">Processing...</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">Select your preferred UPI app to complete the payment</p>
        </TabsContent>

        <TabsContent value="qr-code" className="space-y-4">
          <div className="text-center">
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 inline-block">
              <QrCode className="w-32 h-32 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">QR Code for payment</p>
              <p className="text-xs text-gray-500 mt-1">Amount: {formatPrice(paymentDetails.amount)}</p>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium mb-2">Or copy UPI ID:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 p-2 bg-white rounded border text-sm">merchant@paytm</code>
                <Button variant="outline" size="icon" onClick={() => copyToClipboard("merchant@paytm")}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button
              onClick={() => onSubmit({ method: "qr_code" })}
              disabled={isProcessing}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Verifying Payment..." : "I have made the payment"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Smartphone className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">UPI Payment Benefits</span>
        </div>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Instant payment confirmation</li>
          <li>• No additional charges</li>
          <li>• Secure and encrypted</li>
          <li>• Available 24/7</li>
        </ul>
      </div>
    </div>
  )
}
