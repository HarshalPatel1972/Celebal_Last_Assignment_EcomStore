"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface SearchSuggestionsProps {
  products: any[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onProductSelect?: (product: any) => void
  className?: string
}

export function SearchSuggestions({
  products,
  searchQuery,
  setSearchQuery,
  onProductSelect,
  className = "",
}: SearchSuggestionsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches] = useState([
    "iPhone 15",
    "MacBook Air",
    "Wireless Headphones",
    "Gaming Keyboard",
    "Smart TV",
    "Bluetooth Speaker",
  ])
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("elitecart-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Generate suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 6)
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(searchQuery === "" && document.activeElement === searchRef.current?.querySelector("input"))
    }
  }, [searchQuery, products])

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)

    // Add to recent searches
    if (query.trim() && !recentSearches.includes(query)) {
      const newRecent = [query, ...recentSearches.slice(0, 4)]
      setRecentSearches(newRecent)
      localStorage.setItem("elitecart-recent-searches", JSON.stringify(newRecent))
    }

    setIsOpen(false)
  }

  const handleProductClick = (product: any) => {
    setSearchQuery(product.name)
    setIsOpen(false)
    if (onProductSelect) {
      onProductSelect(product)
    }
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("elitecart-recent-searches")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search for products, brands and more..."
          className="pl-10 pr-4 py-3 rounded-full border-2 border-orange-200 focus:border-orange-500 bg-white/80 backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              handleSearch(searchQuery)
            }
          }}
        />
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {searchQuery.length === 0 ? (
            // Show recent and trending when no search query
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Recent Searches
                    </h4>
                    <button onClick={clearRecentSearches} className="text-xs text-orange-600 hover:text-orange-700">
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Trending Searches
                </h4>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : suggestions.length > 0 ? (
            // Show product suggestions
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-2 border-b">Products ({suggestions.length})</div>
              {suggestions.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 text-left"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.brand} • {product.category}
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-orange-600">₹{product.price.toLocaleString()}</div>
                </button>
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            // No results found
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No products found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try searching for something else</p>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  )
}
