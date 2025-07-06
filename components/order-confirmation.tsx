"use client"

import { useState } from "react"
import { CheckCircle, Download, Truck, Package, MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface OrderConfirmationProps {
  orderData: {
    orderId: string
    items: any[]
    total: number
    gst: number
    deliveryCharges: number
    finalTotal: number
    customerInfo: {
      name: string
      email: string
      phone: string
      address: string
    }
    paymentMethod: string
    estimatedDelivery: string
  }
  formatPrice: (price: number) => string
  onContinueShopping: () => void
}

export function OrderConfirmation({ orderData, formatPrice, onContinueShopping }: OrderConfirmationProps) {
  const [trackingSteps] = useState([
    { id: 1, title: "Order Confirmed", status: "completed", time: "Just now" },
    { id: 2, title: "Processing", status: "current", time: "Within 2 hours" },
    { id: 3, title: "Shipped", status: "pending", time: "1-2 days" },
    { id: 4, title: "Out for Delivery", status: "pending", time: "3-5 days" },
    { id: 5, title: "Delivered", status: "pending", time: orderData.estimatedDelivery },
  ])

  const downloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    alert("Invoice download feature coming soon!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed! 🎉</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-green-200 inline-block">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="text-xl font-bold text-green-600">#{orderData.orderId}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Order Items ({orderData.items.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium text-orange-600">{formatPrice(item.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Order Tracking</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            step.status === "completed"
                              ? "bg-green-500 text-white"
                              : step.status === "current"
                                ? "bg-orange-500 text-white"
                                : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {step.status === "completed" ? "✓" : step.id}
                        </div>
                        {index < trackingSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-8 mt-2 ${step.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.status === "current" ? "text-orange-600" : "text-gray-900"}`}>
                          {step.title}
                        </p>
                        <p className="text-sm text-gray-600">{step.time}</p>
                      </div>
                      {step.status === "current" && (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Current
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Delivery Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-gray-900">{orderData.customerInfo.name}</p>
                    <p className="text-gray-600">{orderData.customerInfo.phone}</p>
                    <p className="text-gray-600">{orderData.customerInfo.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Delivery Address</p>
                    <p className="text-gray-600">{orderData.customerInfo.address}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Estimated delivery: {orderData.estimatedDelivery}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(orderData.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>{formatPrice(orderData.gst)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{orderData.deliveryCharges === 0 ? "FREE" : formatPrice(orderData.deliveryCharges)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Paid:</span>
                    <span className="text-green-600">{formatPrice(orderData.finalTotal)}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">Payment Method: {orderData.paymentMethod}</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button onClick={downloadInvoice} variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Invoice
                  </Button>
                  <Button
                    onClick={onContinueShopping}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">If you have any questions about your order, feel free to contact us.</p>
                  <div className="space-y-1">
                    <p>
                      <strong>Phone:</strong> +91 1800-123-4567
                    </p>
                    <p>
                      <strong>Email:</strong> support@elitecart.in
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
