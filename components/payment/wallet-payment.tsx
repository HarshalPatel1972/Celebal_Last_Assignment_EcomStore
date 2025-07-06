"use client"

import { useState } from "react"
import { Wallet, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/toast-provider"
import type { PaymentDetails } from "@/contexts/payment-context"

interface WalletPaymentProps {
  paymentDetails: PaymentDetails
  onSubmit: (data: any) => void
  isProcessing: boolean
}

export function WalletPayment({ paymentDetails, onSubmit, isProcessing }: WalletPaymentProps) {
  const [selectedWallet, setSelectedWallet] = useState("")
  const { addToast } = useToast()

  const wallets = [
    {
      id: "paytm",
      name: "Paytm Wallet",
      icon: "🔵",
      cashback: "2%",
      minAmount: 1,
      description: "Get 2% cashback on payments above ₹100",
    },
    {
      id: "phonepe",
      name: "PhonePe Wallet",
      icon: "🟣",
      cashback: "1.5%",
      minAmount: 50,
      description: "Earn rewards on every transaction",
    },
    {
      id: "amazonpay",
      name: "Amazon Pay",
      icon: "🟡",
      cashback: "3%",
      minAmount: 200,
      description: "Extra 3% cashback for Prime members",
    },
    {
      id: "mobikwik",
      name: "MobiKwik",
      icon: "🔴",
      cashback: "2.5%",
      minAmount: 100,
      description: "SuperCash rewards on payments",
    },
    {
      id: "freecharge",
      name: "FreeCharge",
      icon: "🟢",
      cashback: "1%",
      minAmount: 1,
      description: "Instant cashback and rewards",
    },
    {
      id: "jiomoney",
      name: "JioMoney",
      icon: "🔵",
      cashback: "1.5%",
      minAmount: 50,
      description: "Earn JioCoins on every payment",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const calculateCashback = (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId)
    if (!wallet || paymentDetails.amount < wallet.minAmount) return 0

    const cashbackPercent = Number.parseFloat(wallet.cashback.replace("%", ""))
    return Math.floor((paymentDetails.amount * cashbackPercent) / 100)
  }

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId)
  }

  const handleSubmit = () => {
    if (!selectedWallet) {
      addToast({
        type: "error",
        title: "Wallet Selection Required",
        description: "Please select a wallet to proceed",
      })
      return
    }

    const selectedWalletData = wallets.find((wallet) => wallet.id === selectedWallet)
    const cashbackAmount = calculateCashback(selectedWallet)

    onSubmit({
      walletId: selectedWallet,
      walletName: selectedWalletData?.name,
      cashbackAmount,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700">Select your wallet</h4>

        <div className="grid gap-3">
          {wallets.map((wallet) => {
            const cashbackAmount = calculateCashback(wallet.id)
            const isEligible = paymentDetails.amount >= wallet.minAmount

            return (
              <Card
                key={wallet.id}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedWallet === wallet.id ? "ring-2 ring-purple-500 bg-purple-50" : ""
                } ${!isEligible ? "opacity-50" : ""}`}
                onClick={() => isEligible && handleWalletSelect(wallet.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{wallet.icon}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-sm">{wallet.name}</p>
                          {isEligible && cashbackAmount > 0 && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              <Gift className="w-3 h-3 mr-1" />₹{cashbackAmount} cashback
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{wallet.description}</p>
                        {!isEligible && (
                          <p className="text-xs text-red-500 mt-1">Minimum amount: ₹{wallet.minAmount}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {isEligible && (
                        <div className="text-sm">
                          <p className="font-medium text-green-600">{wallet.cashback} cashback</p>
                          {cashbackAmount > 0 && <p className="text-xs text-gray-500">≈ ₹{cashbackAmount}</p>}
                        </div>
                      )}
                      {selectedWallet === wallet.id && (
                        <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center mt-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {selectedWallet && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Gift className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Cashback Details</span>
          </div>
          <div className="text-sm text-green-700">
            <p>Payment Amount: {formatPrice(paymentDetails.amount)}</p>
            <p>Cashback: ₹{calculateCashback(selectedWallet)}</p>
            <p className="font-medium">
              Effective Amount: {formatPrice(paymentDetails.amount - calculateCashback(selectedWallet))}
            </p>
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isProcessing || !selectedWallet}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {isProcessing ? "Processing..." : `Pay ${formatPrice(paymentDetails.amount)}`}
      </Button>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Wallet className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">Wallet Benefits</span>
        </div>
        <ul className="text-xs text-purple-700 space-y-1">
          <li>• Instant payment processing</li>
          <li>• Cashback and rewards on transactions</li>
          <li>• No additional charges</li>
          <li>• Secure wallet authentication</li>
        </ul>
      </div>
    </div>
  )
}
