"use client"

import { useState } from "react"
import { CreditCard, Smartphone, Building2, Wallet, Banknote, Calculator, X, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { usePayment, type PaymentDetails, type PaymentMethod } from "@/contexts/payment-context"
import { UPIPayment } from "./upi-payment"
import { CardPayment } from "./card-payment"
import { NetBankingPayment } from "./netbanking-payment"
import { WalletPayment } from "./wallet-payment"
import { EMIPayment } from "./emi-payment"

interface PaymentGatewayProps {
  isOpen: boolean
  onClose: () => void
  paymentDetails: PaymentDetails
  onPaymentSuccess: (transactionId: string) => void
  onPaymentFailure: (error: string) => void
}

export function PaymentGateway({
  isOpen,
  onClose,
  paymentDetails,
  onPaymentSuccess,
  onPaymentFailure,
}: PaymentGatewayProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const { processPayment, isProcessing } = usePayment()

  const paymentMethods = [
    {
      id: "upi" as PaymentMethod,
      name: "UPI",
      icon: Smartphone,
      description: "Pay using UPI ID or scan QR code",
      popular: true,
      processingFee: 0,
      offers: ["Instant refund", "No processing fee"],
    },
    {
      id: "card" as PaymentMethod,
      name: "Cards",
      icon: CreditCard,
      description: "Credit/Debit cards accepted",
      popular: true,
      processingFee: paymentDetails.amount * 0.02, // 2% processing fee
      offers: ["EMI available", "Secure payments"],
    },
    {
      id: "netbanking" as PaymentMethod,
      name: "Net Banking",
      icon: Building2,
      description: "All major banks supported",
      popular: false,
      processingFee: 0,
      offers: ["Direct bank transfer", "Secure"],
    },
    {
      id: "wallet" as PaymentMethod,
      name: "Wallets",
      icon: Wallet,
      description: "Paytm, PhonePe, Amazon Pay & more",
      popular: true,
      processingFee: 0,
      offers: ["Cashback available", "Instant payment"],
    },
    {
      id: "cod" as PaymentMethod,
      name: "Cash on Delivery",
      icon: Banknote,
      description: "Pay when you receive",
      popular: false,
      processingFee: 49, // COD charges
      offers: ["No advance payment", "Pay at doorstep"],
    },
    {
      id: "emi" as PaymentMethod,
      name: "EMI",
      icon: Calculator,
      description: "Easy monthly installments",
      popular: false,
      processingFee: 0,
      offers: ["0% interest available", "Flexible tenure"],
      minAmount: 5000,
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handlePaymentSubmit = async (methodSpecificData?: any) => {
    if (!selectedMethod) return

    setIsProcessingPayment(true)

    try {
      const result = await processPayment({ ...paymentDetails, method: selectedMethod }, methodSpecificData)

      if (result.success && result.transactionId) {
        onPaymentSuccess(result.transactionId)
      } else {
        onPaymentFailure(result.error || "Payment failed")
      }
    } catch (error) {
      onPaymentFailure("Payment processing error")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const renderPaymentForm = () => {
    if (!selectedMethod) return null

    const commonProps = {
      paymentDetails,
      onSubmit: handlePaymentSubmit,
      isProcessing: isProcessingPayment || isProcessing,
    }

    switch (selectedMethod) {
      case "upi":
        return <UPIPayment {...commonProps} />
      case "card":
        return <CardPayment {...commonProps} />
      case "netbanking":
        return <NetBankingPayment {...commonProps} />
      case "wallet":
        return <WalletPayment {...commonProps} />
      case "emi":
        return <EMIPayment {...commonProps} />
      case "cod":
        return (
          <div className="text-center py-8">
            <Banknote className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-semibold mb-2">Cash on Delivery Selected</h3>
            <p className="text-gray-600 mb-4">
              You will pay ₹{paymentDetails.amount + 49} when the order is delivered to your doorstep.
            </p>
            <p className="text-sm text-gray-500 mb-6">Additional COD charges: ₹49</p>
            <Button
              onClick={() => handlePaymentSubmit()}
              className="bg-green-600 hover:bg-green-700"
              disabled={isProcessingPayment || isProcessing}
            >
              {isProcessingPayment || isProcessing ? "Confirming Order..." : "Confirm COD Order"}
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-green-600" />
            <span>Secure Payment</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="md:col-span-2">
            {!selectedMethod ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>

                {/* Popular Methods */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Methods</h4>
                  {paymentMethods
                    .filter((method) => method.popular)
                    .map((method) => {
                      const Icon = method.icon
                      const isDisabled = method.minAmount && paymentDetails.amount < method.minAmount

                      return (
                        <Card
                          key={method.id}
                          className={`cursor-pointer hover:shadow-md transition-all ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => !isDisabled && setSelectedMethod(method.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <Icon className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{method.name}</span>
                                    {method.popular && (
                                      <Badge variant="secondary" className="text-xs">
                                        Popular
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                  {method.offers && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {method.offers.map((offer, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs text-green-600 border-green-600"
                                        >
                                          {offer}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                {method.processingFee > 0 && (
                                  <p className="text-sm text-gray-500">+{formatPrice(method.processingFee)} fee</p>
                                )}
                                {isDisabled && <p className="text-xs text-red-500">Min ₹{method.minAmount} required</p>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>

                {/* Other Methods */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Other Methods</h4>
                  {paymentMethods
                    .filter((method) => !method.popular)
                    .map((method) => {
                      const Icon = method.icon
                      const isDisabled = method.minAmount && paymentDetails.amount < method.minAmount

                      return (
                        <Card
                          key={method.id}
                          className={`cursor-pointer hover:shadow-md transition-all ${
                            isDisabled ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                          onClick={() => !isDisabled && setSelectedMethod(method.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                  <Icon className="w-6 h-6 text-gray-600" />
                                </div>
                                <div>
                                  <span className="font-medium">{method.name}</span>
                                  <p className="text-sm text-gray-600">{method.description}</p>
                                  {method.offers && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {method.offers.map((offer, index) => (
                                        <Badge
                                          key={index}
                                          variant="outline"
                                          className="text-xs text-green-600 border-green-600"
                                        >
                                          {offer}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                {method.processingFee > 0 && (
                                  <p className="text-sm text-gray-500">+{formatPrice(method.processingFee)} fee</p>
                                )}
                                {isDisabled && <p className="text-xs text-red-500">Min ₹{method.minAmount} required</p>}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name} Payment
                  </h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedMethod(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {renderPaymentForm()}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Order Amount:</span>
                <span>{formatPrice(paymentDetails.amount)}</span>
              </div>

              {selectedMethod && (
                <>
                  {paymentMethods.find((m) => m.id === selectedMethod)?.processingFee! > 0 && (
                    <div className="flex justify-between">
                      <span>Processing Fee:</span>
                      <span>
                        {formatPrice(paymentMethods.find((m) => m.id === selectedMethod)?.processingFee || 0)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      {formatPrice(
                        paymentDetails.amount +
                          (paymentMethods.find((m) => m.id === selectedMethod)?.processingFee || 0),
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">100% Secure Payment</span>
              </div>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• 256-bit SSL encryption</li>
                <li>• PCI DSS compliant</li>
                <li>• Your card details are not stored</li>
                <li>• Instant refund on cancellation</li>
              </ul>
            </div>

            <div className="mt-4 flex items-center space-x-2 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Payment will be processed within 2-3 minutes</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
