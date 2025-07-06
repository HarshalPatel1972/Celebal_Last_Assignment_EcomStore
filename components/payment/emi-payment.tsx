"use client"

import { useState } from "react"
import { Calculator, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/toast-provider"
import type { PaymentDetails } from "@/contexts/payment-context"

interface EMIPaymentProps {
  paymentDetails: PaymentDetails
  onSubmit: (data: any) => void
  isProcessing: boolean
}

export function EMIPayment({ paymentDetails, onSubmit, isProcessing }: EMIPaymentProps) {
  const [selectedBank, setSelectedBank] = useState("")
  const [selectedTenure, setSelectedTenure] = useState("")
  const { addToast } = useToast()

  const banks = [
    {
      id: "hdfc",
      name: "HDFC Bank",
      offers: ["0% interest for 3 months", "Special rates for 6-12 months"],
    },
    {
      id: "icici",
      name: "ICICI Bank",
      offers: ["0% interest for 3 months", "Reduced rates for premium cards"],
    },
    {
      id: "sbi",
      name: "State Bank of India",
      offers: ["Low interest rates", "Flexible tenure options"],
    },
    {
      id: "axis",
      name: "Axis Bank",
      offers: ["0% interest for 3 months", "Cashback on EMI payments"],
    },
    {
      id: "kotak",
      name: "Kotak Mahindra Bank",
      offers: ["Special EMI rates", "No processing fee"],
    },
  ]

  const tenureOptions = [
    { months: 3, interestRate: 0, label: "3 months (0% interest)" },
    { months: 6, interestRate: 12, label: "6 months (12% p.a.)" },
    { months: 9, interestRate: 13.5, label: "9 months (13.5% p.a.)" },
    { months: 12, interestRate: 15, label: "12 months (15% p.a.)" },
    { months: 18, interestRate: 16.5, label: "18 months (16.5% p.a.)" },
    { months: 24, interestRate: 18, label: "24 months (18% p.a.)" },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    if (rate === 0) return principal / tenure

    const monthlyRate = rate / (12 * 100)
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    return emi
  }

  const getTotalAmount = (principal: number, rate: number, tenure: number) => {
    const emi = calculateEMI(principal, rate, tenure)
    return emi * tenure
  }

  const getSelectedTenureData = () => {
    return tenureOptions.find((option) => option.months.toString() === selectedTenure)
  }

  const handleSubmit = () => {
    if (!selectedBank) {
      addToast({
        type: "error",
        title: "Bank Selection Required",
        description: "Please select your bank for EMI",
      })
      return
    }

    if (!selectedTenure) {
      addToast({
        type: "error",
        title: "Tenure Selection Required",
        description: "Please select EMI tenure",
      })
      return
    }

    const tenureData = getSelectedTenureData()
    const selectedBankData = banks.find((bank) => bank.id === selectedBank)

    if (tenureData) {
      const emiAmount = calculateEMI(paymentDetails.amount, tenureData.interestRate, tenureData.months)
      const totalAmount = getTotalAmount(paymentDetails.amount, tenureData.interestRate, tenureData.months)

      onSubmit({
        bankId: selectedBank,
        bankName: selectedBankData?.name,
        tenure: tenureData.months,
        interestRate: tenureData.interestRate,
        emiAmount,
        totalAmount,
      })
    }
  }

  const minEMIAmount = 5000

  if (paymentDetails.amount < minEMIAmount) {
    return (
      <div className="text-center py-8">
        <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2 text-gray-800">EMI Not Available</h3>
        <p className="text-gray-600 mb-4">EMI option is available for orders above {formatPrice(minEMIAmount)}</p>
        <p className="text-sm text-gray-500">Current order amount: {formatPrice(paymentDetails.amount)}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="bankSelect">Select your bank</Label>
          <Select value={selectedBank} onValueChange={setSelectedBank}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose your bank" />
            </SelectTrigger>
            <SelectContent>
              {banks.map((bank) => (
                <SelectItem key={bank.id} value={bank.id}>
                  {bank.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedBank && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 mb-1">Special Offers</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                {banks
                  .find((b) => b.id === selectedBank)
                  ?.offers.map((offer, index) => (
                    <li key={index}>• {offer}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="tenureSelect">Select EMI tenure</Label>
          <Select value={selectedTenure} onValueChange={setSelectedTenure}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose tenure" />
            </SelectTrigger>
            <SelectContent>
              {tenureOptions.map((option) => (
                <SelectItem key={option.months} value={option.months.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedTenure && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">EMI Breakdown</h4>
            {tenureOptions
              .filter((option) => option.months.toString() === selectedTenure)
              .map((option) => {
                const emiAmount = calculateEMI(paymentDetails.amount, option.interestRate, option.months)
                const totalAmount = getTotalAmount(paymentDetails.amount, option.interestRate, option.months)
                const totalInterest = totalAmount - paymentDetails.amount

                return (
                  <Card key={option.months} className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Monthly EMI</p>
                          <p className="text-lg font-semibold text-green-600">{formatPrice(emiAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Amount</p>
                          <p className="text-lg font-semibold">{formatPrice(totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Interest Rate</p>
                          <p className="font-medium">{option.interestRate}% p.a.</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Interest</p>
                          <p className="font-medium">{formatPrice(totalInterest)}</p>
                        </div>
                      </div>
                      {option.interestRate === 0 && (
                        <Badge className="mt-2 bg-green-100 text-green-800">🎉 No Interest - Limited Time Offer!</Badge>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isProcessing || !selectedBank || !selectedTenure}
        className="w-full bg-indigo-600 hover:bg-indigo-700"
      >
        {isProcessing ? "Processing..." : "Proceed with EMI"}
      </Button>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Important Information</span>
        </div>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• EMI will be charged to your credit card</li>
          <li>• First EMI will be charged immediately</li>
          <li>• Subsequent EMIs on the same date every month</li>
          <li>• Pre-closure charges may apply as per bank terms</li>
          <li>• Interest rates are subject to bank approval</li>
        </ul>
      </div>
    </div>
  )
}
