"use client"

import { useState } from "react"
import { Building2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/toast-provider"
import type { PaymentDetails } from "@/contexts/payment-context"

interface NetBankingPaymentProps {
  paymentDetails: PaymentDetails
  onSubmit: (data: any) => void
  isProcessing: boolean
}

export function NetBankingPayment({ paymentDetails, onSubmit, isProcessing }: NetBankingPaymentProps) {
  const [selectedBank, setSelectedBank] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { addToast } = useToast()

  const popularBanks = [
    { id: "sbi", name: "State Bank of India", code: "SBI" },
    { id: "hdfc", name: "HDFC Bank", code: "HDFC" },
    { id: "icici", name: "ICICI Bank", code: "ICICI" },
    { id: "axis", name: "Axis Bank", code: "AXIS" },
    { id: "kotak", name: "Kotak Mahindra Bank", code: "KOTAK" },
    { id: "pnb", name: "Punjab National Bank", code: "PNB" },
  ]

  const allBanks = [
    ...popularBanks,
    { id: "bob", name: "Bank of Baroda", code: "BOB" },
    { id: "canara", name: "Canara Bank", code: "CANARA" },
    { id: "union", name: "Union Bank of India", code: "UNION" },
    { id: "indian", name: "Indian Bank", code: "INDIAN" },
    { id: "central", name: "Central Bank of India", code: "CENTRAL" },
    { id: "boi", name: "Bank of India", code: "BOI" },
    { id: "idbi", name: "IDBI Bank", code: "IDBI" },
    { id: "yes", name: "Yes Bank", code: "YES" },
    { id: "indusind", name: "IndusInd Bank", code: "INDUSIND" },
    { id: "federal", name: "Federal Bank", code: "FEDERAL" },
    { id: "karur", name: "Karur Vysya Bank", code: "KVB" },
    { id: "south", name: "South Indian Bank", code: "SIB" },
    { id: "catholic", name: "Catholic Syrian Bank", code: "CSB" },
    { id: "city", name: "City Union Bank", code: "CUB" },
  ]

  const filteredBanks = allBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bank.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId)
  }

  const handleSubmit = () => {
    if (!selectedBank) {
      addToast({
        type: "error",
        title: "Bank Selection Required",
        description: "Please select your bank to proceed",
      })
      return
    }

    const selectedBankData = allBanks.find((bank) => bank.id === selectedBank)
    onSubmit({
      bankId: selectedBank,
      bankName: selectedBankData?.name,
      bankCode: selectedBankData?.code,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="bankSearch">Search for your bank</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="bankSearch"
              placeholder="Search bank name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 mt-1"
            />
          </div>
        </div>

        {!searchTerm && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Popular Banks</h4>
            <div className="grid grid-cols-2 gap-3">
              {popularBanks.map((bank) => (
                <Card
                  key={bank.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${
                    selectedBank === bank.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => handleBankSelect(bank.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{bank.code}</p>
                        <p className="text-xs text-gray-600 truncate">{bank.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">{searchTerm ? "Search Results" : "All Banks"}</h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredBanks.map((bank) => (
              <Card
                key={bank.id}
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedBank === bank.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handleBankSelect(bank.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{bank.name}</p>
                      <p className="text-xs text-gray-600">{bank.code}</p>
                    </div>
                    {selectedBank === bank.id && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBanks.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No banks found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isProcessing || !selectedBank}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isProcessing ? "Redirecting to Bank..." : `Pay ${formatPrice(paymentDetails.amount)}`}
      </Button>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Net Banking Benefits</span>
        </div>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Direct transfer from your bank account</li>
          <li>• No additional charges</li>
          <li>• Secure bank-level authentication</li>
          <li>• Instant payment confirmation</li>
        </ul>
      </div>
    </div>
  )
}
