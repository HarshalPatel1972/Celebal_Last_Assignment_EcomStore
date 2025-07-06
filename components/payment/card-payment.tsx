"use client"

import type React from "react"

import { useState } from "react"
import { CreditCard, Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/toast-provider"
import type { PaymentDetails } from "@/contexts/payment-context"

interface CardPaymentProps {
  paymentDetails: PaymentDetails
  onSubmit: (data: any) => void
  isProcessing: boolean
}

export function CardPayment({ paymentDetails, onSubmit, isProcessing }: CardPaymentProps) {
  const [cardNumber, setCardNumber] = useState("")
  const [expiryMonth, setExpiryMonth] = useState("")
  const [expiryYear, setExpiryYear] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [showCvv, setShowCvv] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const { addToast } = useToast()

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, "")
    if (/^4/.test(num)) return "Visa"
    if (/^5[1-5]/.test(num)) return "Mastercard"
    if (/^6/.test(num)) return "RuPay"
    if (/^3[47]/.test(num)) return "American Express"
    return "Unknown"
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) {
      setCardNumber(formatted)
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  const validateForm = () => {
    if (!cardNumber.trim()) {
      addToast({
        type: "error",
        title: "Card Number Required",
        description: "Please enter your card number",
      })
      return false
    }

    if (cardNumber.replace(/\s/g, "").length < 13) {
      addToast({
        type: "error",
        title: "Invalid Card Number",
        description: "Please enter a valid card number",
      })
      return false
    }

    if (!expiryMonth || !expiryYear) {
      addToast({
        type: "error",
        title: "Expiry Date Required",
        description: "Please select card expiry date",
      })
      return false
    }

    if (!cvv.trim()) {
      addToast({
        type: "error",
        title: "CVV Required",
        description: "Please enter your card CVV",
      })
      return false
    }

    if (cvv.length < 3) {
      addToast({
        type: "error",
        title: "Invalid CVV",
        description: "Please enter a valid CVV",
      })
      return false
    }

    if (!cardholderName.trim()) {
      addToast({
        type: "error",
        title: "Cardholder Name Required",
        description: "Please enter cardholder name",
      })
      return false
    }

    return true
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const cardData = {
      cardNumber: cardNumber.replace(/\s/g, ""),
      expiryMonth,
      expiryYear,
      cvv,
      cardholderName,
      cardType: getCardType(cardNumber),
      saveCard,
    }

    onSubmit(cardData)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i)
  const months = [
    { value: "01", label: "01 - January" },
    { value: "02", label: "02 - February" },
    { value: "03", label: "03 - March" },
    { value: "04", label: "04 - April" },
    { value: "05", label: "05 - May" },
    { value: "06", label: "06 - June" },
    { value: "07", label: "07 - July" },
    { value: "08", label: "08 - August" },
    { value: "09", label: "09 - September" },
    { value: "10", label: "10 - October" },
    { value: "11", label: "11 - November" },
    { value: "12", label: "12 - December" },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <div className="relative">
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="mt-1 pr-20"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              {cardNumber && <span className="text-xs font-medium text-gray-600">{getCardType(cardNumber)}</span>}
              <CreditCard className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            placeholder="Name as on card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="expiryMonth">Expiry Month</Label>
            <Select value={expiryMonth} onValueChange={setExpiryMonth}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expiryYear">Expiry Year</Label>
            <Select value={expiryYear} onValueChange={setExpiryYear}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cvv">CVV</Label>
            <div className="relative">
              <Input
                id="cvv"
                type={showCvv ? "text" : "password"}
                placeholder="123"
                value={cvv}
                onChange={handleCvvChange}
                className="mt-1 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8"
                onClick={() => setShowCvv(!showCvv)}
              >
                {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="saveCard" checked={saveCard} onCheckedChange={(checked) => setSaveCard(checked as boolean)} />
          <Label htmlFor="saveCard" className="text-sm">
            Save this card for future payments
          </Label>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={isProcessing} className="w-full bg-blue-600 hover:bg-blue-700">
        {isProcessing ? "Processing..." : `Pay ${formatPrice(paymentDetails.amount)}`}
      </Button>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">Your card is secure</span>
        </div>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• Your card details are encrypted and secure</li>
          <li>• We don't store your card information</li>
          <li>• PCI DSS compliant payment processing</li>
          <li>• 3D Secure authentication for added security</li>
        </ul>
      </div>
    </div>
  )
}
