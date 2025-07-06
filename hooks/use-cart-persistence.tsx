"use client"

import { useEffect, useState } from "react"

const CART_STORAGE_KEY = "elitecart-cart"
const WISHLIST_STORAGE_KEY = "elitecart-wishlist"

export function useCartPersistence() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      const savedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY)

      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
    } catch (error) {
      console.error("Error loading cart data:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
      } catch (error) {
        console.error("Error saving cart:", error)
      }
    }
  }, [cartItems, isLoaded])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist))
      } catch (error) {
        console.error("Error saving wishlist:", error)
      }
    }
  }, [wishlist, isLoaded])

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems((prev) => prev.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return {
    cartItems,
    wishlist,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    clearWishlist,
  }
}
