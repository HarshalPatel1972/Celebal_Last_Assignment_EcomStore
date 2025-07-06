"use client"

import { useState } from "react"
import {
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Banknote,
  Calculator,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePayment, type PaymentTransaction, type PaymentMethod } from "@/contexts/payment-context"

interface PaymentHistoryProps {
  isOpen: boolean
  onClose: () => void
}

export function PaymentHistory({ isOpen, onClose }: PaymentHistoryProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterMethod, setFilterMethod] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)

  const { getPaymentHistory, refundPayment, isProcessing } = usePayment()
  const transactions = getPaymentHistory()

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "upi":
        return Smartphone
      case "card":
        return CreditCard
      case "netbanking":
        return Building2
      case "wallet":
        return Wallet
      case "cod":
        return Banknote
      case "emi":
        return Calculator
      default:
        return CreditCard
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "pending":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus
    const matchesMethod = filterMethod === "all" || transaction.method === filterMethod
    const matchesSearch =
      transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.gatewayTransactionId &&
        transaction.gatewayTransactionId.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesStatus && matchesMethod && matchesSearch
  })

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleRefund = async (transactionId: string) => {
    await refundPayment(transactionId)
  }

  const downloadReceipt = (transaction: PaymentTransaction) => {
    // In a real app, this would generate and download a PDF receipt
    alert(`Receipt for transaction ${transaction.id} will be downloaded`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Payment History</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by Order ID, Transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterMethod} onValueChange={setFilterMethod}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="netbanking">Net Banking</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
                <SelectItem value="cod">Cash on Delivery</SelectItem>
                <SelectItem value="emi">EMI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No Transactions Found</h3>
                <p className="text-gray-600">
                  {transactions.length === 0
                    ? "You haven't made any payments yet"
                    : "No transactions match your current filters"}
                </p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => {
                const MethodIcon = getMethodIcon(transaction.method)
                return (
                  <Card key={transaction.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <MethodIcon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold">Order #{transaction.orderId}</span>
                              <Badge className={getStatusColor(transaction.status)}>
                                {getStatusIcon(transaction.status)}
                                <span className="ml-1 capitalize">{transaction.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              {formatDate(transaction.timestamp)} • {transaction.method.toUpperCase()}
                            </p>
                            {transaction.gatewayTransactionId && (
                              <p className="text-xs text-gray-500 font-mono">
                                Transaction ID: {transaction.gatewayTransactionId}
                              </p>
                            )}
                            {transaction.failureReason && (
                              <p className="text-xs text-red-600 mt-1">{transaction.failureReason}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold">{formatAmount(transaction.amount)}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            {transaction.status === "success" && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => downloadReceipt(transaction)}>
                                  <Download className="w-3 h-3 mr-1" />
                                  Receipt
                                </Button>
                                {!transaction.refundId && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRefund(transaction.id)}
                                    disabled={isProcessing}
                                  >
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    Refund
                                  </Button>
                                )}
                              </>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              View Details
                            </Button>
                          </div>
                          {transaction.refundId && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                Refunded: {formatAmount(transaction.refundAmount || 0)}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Transaction Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Transaction ID:</span>
                        <span className="font-mono">{selectedTransaction.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-mono">{selectedTransaction.orderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gateway ID:</span>
                        <span className="font-mono">{selectedTransaction.gatewayTransactionId || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date & Time:</span>
                        <span>{formatDate(selectedTransaction.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Payment Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">{formatAmount(selectedTransaction.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="capitalize">{selectedTransaction.method}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedTransaction.status)}>
                          {selectedTransaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedTransaction.refundId && (
                  <div>
                    <h4 className="font-semibold mb-2">Refund Information</h4>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Refund ID:</span>
                          <span className="font-mono">{selectedTransaction.refundId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Refund Amount:</span>
                          <span className="font-semibold">{formatAmount(selectedTransaction.refundAmount || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Refund Status:</span>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {selectedTransaction.refundStatus}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTransaction.failureReason && (
                  <div>
                    <h4 className="font-semibold mb-2">Failure Information</h4>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{selectedTransaction.failureReason}</p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  {selectedTransaction.status === "success" && (
                    <Button onClick={() => downloadReceipt(selectedTransaction)} className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download Receipt
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedTransaction(null)} className="flex-1">
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
