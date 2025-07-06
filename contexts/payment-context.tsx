"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useToast } from "@/components/toast-provider"

export type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod" | "emi"

export interface PaymentDetails {
  method: PaymentMethod
  amount: number
  currency: string
  orderId: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  billingAddress?: {
    address: string
    city: string
    state: string
    pincode: string
  }
}

export interface PaymentTransaction {
  id: string
  orderId: string
  method: PaymentMethod
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  timestamp: string
  gatewayTransactionId?: string
  failureReason?: string
  refundId?: string
  refundAmount?: number
  refundStatus?: "pending" | "processed" | "failed"
}

interface PaymentContextType {
  isProcessing: boolean
  processPayment: (
    details: PaymentDetails,
    methodSpecificData?: any,
  ) => Promise<{ success: boolean; transactionId?: string; error?: string }>
  getPaymentHistory: () => PaymentTransaction[]
  refundPayment: (transactionId: string) => Promise<boolean>
  getPaymentMethods: () => PaymentMethod[]
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined)

export function usePayment() {
  const context = useContext(PaymentContext)
  if (!context) {
    throw new Error("usePayment must be used within a PaymentProvider")
  }
  return context
}

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("elitecart-payment-history")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const { addToast } = useToast()

  const saveTransactions = useCallback((newTransactions: PaymentTransaction[]) => {
    setTransactions(newTransactions)
    if (typeof window !== "undefined") {
      localStorage.setItem("elitecart-payment-history", JSON.stringify(newTransactions))
    }
  }, [])

  const processPayment = useCallback(
    async (
      details: PaymentDetails,
      methodSpecificData?: any,
    ): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
      setIsProcessing(true)

      try {
        // Create transaction record
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`
        const gatewayTransactionId = `RZP${Date.now()}${Math.random().toString(36).substr(2, 6)}`

        const transaction: PaymentTransaction = {
          id: transactionId,
          orderId: details.orderId,
          method: details.method,
          amount: details.amount,
          status: "processing",
          timestamp: new Date().toISOString(),
          gatewayTransactionId,
        }

        // Add transaction to history
        const newTransactions = [transaction, ...transactions]
        saveTransactions(newTransactions)

        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 3000))

        // Simulate payment success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1

        if (isSuccess) {
          // Update transaction status to success
          const updatedTransactions = newTransactions.map((t) =>
            t.id === transactionId ? { ...t, status: "success" as const } : t,
          )
          saveTransactions(updatedTransactions)

          return { success: true, transactionId: gatewayTransactionId }
        } else {
          // Update transaction status to failed
          const failureReasons = [
            "Insufficient funds",
            "Card declined by bank",
            "Transaction timeout",
            "Invalid OTP",
            "Bank server error",
            "Payment cancelled by user",
          ]
          const failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)]

          const updatedTransactions = newTransactions.map((t) =>
            t.id === transactionId ? { ...t, status: "failed" as const, failureReason } : t,
          )
          saveTransactions(updatedTransactions)

          return { success: false, error: failureReason }
        }
      } catch (error) {
        return { success: false, error: "Payment processing failed" }
      } finally {
        setIsProcessing(false)
      }
    },
    [transactions, saveTransactions],
  )

  const getPaymentHistory = useCallback(() => {
    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [transactions])

  const refundPayment = useCallback(
    async (transactionId: string): Promise<boolean> => {
      setIsProcessing(true)

      try {
        const transaction = transactions.find((t) => t.gatewayTransactionId === transactionId || t.id === transactionId)
        if (!transaction || transaction.status !== "success") {
          addToast({
            type: "error",
            title: "Refund Failed",
            description: "Transaction not found or not eligible for refund",
          })
          return false
        }

        // Simulate refund processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const refundId = `RFD${Date.now()}${Math.random().toString(36).substr(2, 6)}`
        const updatedTransactions = transactions.map((t) =>
          t.id === transaction.id
            ? {
                ...t,
                refundId,
                refundAmount: t.amount,
                refundStatus: "processed" as const,
              }
            : t,
        )

        saveTransactions(updatedTransactions)

        addToast({
          type: "success",
          title: "Refund Initiated",
          description: `Refund of ₹${transaction.amount} has been processed. It will reflect in your account within 5-7 business days.`,
          duration: 5000,
        })

        return true
      } catch (error) {
        addToast({
          type: "error",
          title: "Refund Failed",
          description: "Unable to process refund. Please contact customer support.",
        })
        return false
      } finally {
        setIsProcessing(false)
      }
    },
    [transactions, saveTransactions, addToast],
  )

  const getPaymentMethods = useCallback((): PaymentMethod[] => {
    return ["upi", "card", "netbanking", "wallet", "cod", "emi"]
  }, [])

  return (
    <PaymentContext.Provider
      value={{
        isProcessing,
        processPayment,
        getPaymentHistory,
        refundPayment,
        getPaymentMethods,
      }}
    >
      {children}
    </PaymentContext.Provider>
  )
}
