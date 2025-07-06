"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/toast-provider"

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  addresses: Address[]
  createdAt: string
}

interface Address {
  id: string
  type: "home" | "work" | "other"
  name: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (userData: Partial<User>) => Promise<boolean>
  addAddress: (address: Omit<Address, "id">) => Promise<boolean>
  updateAddress: (id: string, address: Partial<Address>) => Promise<boolean>
  deleteAddress: (id: string) => Promise<boolean>
  sendOTP: (phone: string) => Promise<boolean>
  verifyOTP: (phone: string, otp: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { addToast } = useToast()

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("elitecart-user")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading user:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("elitecart-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("elitecart-user")
    }
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock authentication - in real app, this would be an API call
      if (email === "demo@elitecart.in" && password === "demo123") {
        const mockUser: User = {
          id: "user_123",
          name: "Demo User",
          email: "demo@elitecart.in",
          phone: "+91 98765 43210",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          addresses: [
            {
              id: "addr_1",
              type: "home",
              name: "Demo User",
              phone: "+91 98765 43210",
              address: "123 Main Street, Andheri West",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400058",
              isDefault: true,
            },
          ],
          createdAt: new Date().toISOString(),
        }

        setUser(mockUser)
        addToast({
          type: "success",
          title: "Welcome back! 👋",
          description: "You have successfully logged in.",
          duration: 3000,
        })
        return true
      } else {
        addToast({
          type: "error",
          title: "Login Failed",
          description: "Invalid email or password. Try demo@elitecart.in / demo123",
          duration: 4000,
        })
        return false
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Login Error",
        description: "Something went wrong. Please try again.",
        duration: 3000,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newUser: User = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        addresses: [],
        createdAt: new Date().toISOString(),
      }

      setUser(newUser)
      addToast({
        type: "success",
        title: "Account Created! 🎉",
        description: "Welcome to EliteCart India!",
        duration: 3000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        duration: 3000,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    addToast({
      type: "info",
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 2000,
    })
  }

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false

      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)

      addToast({
        type: "success",
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        duration: 2000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        duration: 3000,
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const addAddress = async (addressData: Omit<Address, "id">): Promise<boolean> => {
    try {
      if (!user) return false

      const newAddress: Address = {
        ...addressData,
        id: `addr_${Date.now()}`,
      }

      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress],
      }

      setUser(updatedUser)
      addToast({
        type: "success",
        title: "Address Added",
        description: "New address has been added successfully.",
        duration: 2000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to Add Address",
        description: "Please try again.",
        duration: 3000,
      })
      return false
    }
  }

  const updateAddress = async (id: string, addressData: Partial<Address>): Promise<boolean> => {
    try {
      if (!user) return false

      const updatedAddresses = user.addresses.map((addr) => (addr.id === id ? { ...addr, ...addressData } : addr))

      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
      }

      setUser(updatedUser)
      addToast({
        type: "success",
        title: "Address Updated",
        description: "Address has been updated successfully.",
        duration: 2000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Update Failed",
        description: "Failed to update address. Please try again.",
        duration: 3000,
      })
      return false
    }
  }

  const deleteAddress = async (id: string): Promise<boolean> => {
    try {
      if (!user) return false

      const updatedAddresses = user.addresses.filter((addr) => addr.id !== id)
      const updatedUser = {
        ...user,
        addresses: updatedAddresses,
      }

      setUser(updatedUser)
      addToast({
        type: "success",
        title: "Address Deleted",
        description: "Address has been removed successfully.",
        duration: 2000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Delete Failed",
        description: "Failed to delete address. Please try again.",
        duration: 3000,
      })
      return false
    }
  }

  const sendOTP = async (phone: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock OTP sending
      addToast({
        type: "success",
        title: "OTP Sent! 📱",
        description: `Verification code sent to ${phone}. Use 123456 for demo.`,
        duration: 5000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Failed to Send OTP",
        description: "Please check your phone number and try again.",
        duration: 3000,
      })
      return false
    }
  }

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock OTP verification
      if (otp === "123456") {
        addToast({
          type: "success",
          title: "Phone Verified! ✅",
          description: "Your phone number has been verified successfully.",
          duration: 3000,
        })
        return true
      } else {
        addToast({
          type: "error",
          title: "Invalid OTP",
          description: "Please enter the correct verification code.",
          duration: 3000,
        })
        return false
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Verification Failed",
        description: "Please try again.",
        duration: 3000,
      })
      return false
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      addToast({
        type: "success",
        title: "Reset Link Sent! 📧",
        description: `Password reset instructions sent to ${email}`,
        duration: 4000,
      })
      return true
    } catch (error) {
      addToast({
        type: "error",
        title: "Reset Failed",
        description: "Please check your email and try again.",
        duration: 3000,
      })
      return false
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    sendOTP,
    verifyOTP,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
