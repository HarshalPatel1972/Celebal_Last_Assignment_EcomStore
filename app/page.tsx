"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Heart,
  User,
  Star,
  Grid,
  List,
  Plus,
  Minus,
  X,
  Menu,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Image from "next/image";

// Import new components
import { ToastProvider, useToast } from "@/components/toast-provider";
import { OrderConfirmation } from "@/components/order-confirmation";
import { SearchSuggestions } from "@/components/search-suggestions";
import { useCartPersistence } from "@/hooks/use-cart-persistence";

import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { LoginDialog } from "@/components/auth/login-dialog";
import { RegisterDialog } from "@/components/auth/register-dialog";
import { UserProfile } from "@/components/auth/user-profile";

import { PaymentProvider } from "@/contexts/payment-context";
import { PaymentGateway } from "@/components/payment/payment-gateway";
import { PaymentHistory } from "@/components/payment/payment-history";

// Sample product data with Indian pricing and REAL IMAGES
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 134900,
    originalPrice: 149900,
    discount: 10,
    rating: 4.8,
    reviews: 2847,
    image:
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
    category: "Smartphones",
    brand: "Apple",
    inStock: true,
    description: "Latest iPhone with titanium design and A17 Pro chip",
    features: ["A17 Pro Chip", "48MP Camera", "Titanium Design", "USB-C"],
  },
  {
    id: 2,
    name: "MacBook Air M2",
    price: 114900,
    originalPrice: 124900,
    discount: 8,
    rating: 4.9,
    reviews: 1523,
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
    category: "Laptops",
    brand: "Apple",
    inStock: true,
    description: "Ultra-thin laptop with M2 chip and all-day battery",
    features: [
      "M2 Chip",
      "18-hour battery",
      "13.6-inch display",
      "1080p Camera",
    ],
  },
  {
    id: 3,
    name: "Sony WH-1000XM5 Headphones",
    price: 29990,
    originalPrice: 34990,
    discount: 14,
    rating: 4.7,
    reviews: 3421,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Sony",
    inStock: true,
    description: "Industry-leading noise canceling headphones",
    features: [
      "Active Noise Canceling",
      "30-hour battery",
      "Quick Charge",
      "Multipoint Connection",
    ],
  },
  {
    id: 4,
    name: "Canon EOS R6 Camera",
    price: 209995,
    originalPrice: 229995,
    discount: 9,
    rating: 4.6,
    reviews: 892,
    image:
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Canon",
    inStock: true,
    description: "Professional mirrorless camera with 4K video",
    features: [
      "20.1MP Sensor",
      "4K Video",
      "In-body Stabilization",
      "Dual Pixel AF",
    ],
  },
  {
    id: 5,
    name: "Gaming Mechanical Keyboard",
    price: 8999,
    originalPrice: 12999,
    discount: 31,
    rating: 4.5,
    reviews: 1876,
    image:
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Razer",
    inStock: true,
    description: "RGB mechanical keyboard for gaming enthusiasts",
    features: [
      "Mechanical Switches",
      "RGB Lighting",
      "Programmable Keys",
      "Gaming Mode",
    ],
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    price: 2499,
    originalPrice: 3999,
    discount: 38,
    rating: 4.3,
    reviews: 2341,
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Belkin",
    inStock: true,
    description: "Fast wireless charging for all Qi-enabled devices",
    features: [
      "15W Fast Charging",
      "LED Indicator",
      "Case Compatible",
      "Safety Features",
    ],
  },
  {
    id: 7,
    name: "Samsung Galaxy S24",
    price: 79999,
    originalPrice: 89999,
    discount: 11,
    rating: 4.6,
    reviews: 1987,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
    category: "Smartphones",
    brand: "Samsung",
    inStock: true,
    description: "Latest Galaxy with AI-powered photography",
    features: [
      "AI Photography",
      "120Hz Display",
      "5000mAh Battery",
      "S Pen Support",
    ],
  },
  {
    id: 8,
    name: "Dell XPS 13 Laptop",
    price: 105990,
    originalPrice: 115990,
    discount: 9,
    rating: 4.4,
    reviews: 1234,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
    category: "Laptops",
    brand: "Dell",
    inStock: true,
    description: "Ultra-portable laptop with InfinityEdge display",
    features: [
      "InfinityEdge Display",
      "Intel Core i7",
      "16GB RAM",
      "512GB SSD",
    ],
  },
  {
    id: 9,
    name: "Boat Airdopes Earbuds",
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    rating: 4.2,
    reviews: 5432,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Boat",
    inStock: true,
    description: "True wireless earbuds with deep bass",
    features: ["True Wireless", "Deep Bass", "Touch Controls", "IPX4 Rating"],
  },
  {
    id: 10,
    name: 'Mi Smart TV 55"',
    price: 39999,
    originalPrice: 49999,
    discount: 20,
    rating: 4.5,
    reviews: 3210,
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Xiaomi",
    inStock: true,
    description: "4K Android TV with Dolby Vision and Atmos",
    features: ["4K UHD", "Android TV", "Dolby Vision", "Voice Remote"],
  },
  {
    id: 11,
    name: "Realme Smartwatch",
    price: 4999,
    originalPrice: 6999,
    discount: 29,
    rating: 4.1,
    reviews: 2876,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "Realme",
    inStock: true,
    description: "Fitness tracker with heart rate monitoring",
    features: [
      "Heart Rate Monitor",
      "Sleep Tracking",
      "14-day Battery",
      "Water Resistant",
    ],
  },
  {
    id: 12,
    name: "JBL Bluetooth Speaker",
    price: 7999,
    originalPrice: 9999,
    discount: 20,
    rating: 4.4,
    reviews: 1654,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    category: "Electronics",
    brand: "JBL",
    inStock: true,
    description: "Portable speaker with powerful bass and waterproof design",
    features: ["Waterproof", "12-hour Battery", "JBL Bass", "Bluetooth 5.1"],
  },
];

const categories = [
  { name: "All", icon: "🛍️", count: 1234 },
  { name: "Smartphones", icon: "📱", count: 245 },
  { name: "Laptops", icon: "💻", count: 189 },
  { name: "Electronics", icon: "🔌", count: 567 },
  { name: "Fashion", icon: "👕", count: 1234 },
  { name: "Home & Kitchen", icon: "🏠", count: 892 },
  { name: "Books", icon: "📚", count: 2341 },
  { name: "Beauty", icon: "💄", count: 678 },
  { name: "Sports", icon: "⚽", count: 456 },
];

const brands = [
  "Apple",
  "Samsung",
  "Sony",
  "Canon",
  "Dell",
  "Xiaomi",
  "Boat",
  "JBL",
  "Realme",
  "Razer",
  "Belkin",
];

const navItems = [
  { name: "Home", href: "#home" },
  { name: "Categories", href: "#categories" },
  { name: "Offers", href: "#offers" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

function EliteCartIndiaContent() {
  const { addToast } = useToast();
  const {
    cartItems,
    wishlist,
    isLoaded,
    addToCart: addToCartPersistent,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist: toggleWishlistPersistent,
  } = useCartPersistence();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [priceRange, setPriceRange] = useState([500, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showFilters, setShowFilters] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  const heroSlides = [
    {
      title: "India's Premium Shopping Destination",
      subtitle: "Upto 70% Off on Electronics",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=500&fit=crop",
      gradient: "from-purple-900 via-blue-900 to-indigo-900",
    },
    {
      title: "Latest Smartphones & Gadgets",
      subtitle: "Free Delivery Across India",
      image:
        "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=800&h=500&fit=crop",
      gradient: "from-orange-900 via-red-900 to-pink-900",
    },
    {
      title: "Premium Electronics Collection",
      subtitle: "Exclusive Deals Just for You",
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=500&fit=crop",
      gradient: "from-green-900 via-teal-900 to-blue-900",
    },
  ];

  // Auto-slide hero banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Filter products
  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.includes(product.brand);
      const matchesRating = product.rating >= minRating;
      const matchesStock = !inStockOnly || product.inStock;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesBrand &&
        matchesRating &&
        matchesStock
      );
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Keep original order for newest
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [
    searchQuery,
    selectedCategory,
    priceRange,
    selectedBrands,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const addToCart = (product: any) => {
    addToCartPersistent(product);
    addToast({
      type: "success",
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  const toggleWishlist = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    const isInWishlist = wishlist.includes(productId);

    toggleWishlistPersistent(productId);

    if (product) {
      addToast({
        type: isInWishlist ? "info" : "success",
        title: isInWishlist ? "Removed from Wishlist" : "Added to Wishlist!",
        description: `${product.name} has been ${
          isInWishlist ? "removed from" : "added to"
        } your wishlist.`,
        duration: 3000,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const gst = cartTotal * 0.18;
  const deliveryCharges = cartTotal > 99900 ? 0 : 99;
  const finalTotal = cartTotal + gst + deliveryCharges;

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([500, 50000]);
    setSelectedBrands([]);
    setMinRating(0);
    setInStockOnly(false);
    setSearchQuery("");
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOrderPlacement = () => {
    if (!isAuthenticated) {
      addToast({
        type: "warning",
        title: "Login Required",
        description: "Please login to place your order.",
      });
      setIsLoginOpen(true);
      return;
    }

    // Generate order data
    const orderId = `EC${Date.now().toString().slice(-8)}`;

    const newPaymentDetails = {
      method: "upi" as const,
      amount: finalTotal,
      currency: "INR",
      orderId,
      customerInfo: {
        name: user?.name || "Guest User",
        email: user?.email || "guest@example.com",
        phone: user?.phone || "+91 98765 43210",
      },
      billingAddress: user?.addresses?.[0]
        ? {
            address: user.addresses[0].address,
            city: user.addresses[0].city,
            state: user.addresses[0].state,
            pincode: user.addresses[0].pincode,
          }
        : undefined,
    };

    setPaymentDetails(newPaymentDetails);
    setIsCheckoutOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    const orderId =
      paymentDetails?.orderId || `EC${Date.now().toString().slice(-8)}`;
    const estimatedDelivery = new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const newOrderData = {
      orderId,
      items: cartItems,
      total: cartTotal,
      gst,
      deliveryCharges,
      finalTotal,
      customerInfo: {
        name: user?.name || "Guest User",
        email: user?.email || "guest@example.com",
        phone: user?.phone || "+91 98765 43210",
        address:
          user?.addresses?.[0]?.address ||
          "123 Main Street, Mumbai, Maharashtra 400001",
      },
      paymentMethod: "Online Payment",
      estimatedDelivery,
      transactionId,
    };

    setOrderData(newOrderData);
    clearCart();
    setCheckoutStep(1);
    setShowOrderConfirmation(true);
    setIsPaymentOpen(false);

    addToast({
      type: "success",
      title: "Order Placed Successfully! 🎉",
      description: `Your order #${orderId} has been confirmed.`,
      duration: 5000,
    });
  };

  const handlePaymentFailure = (error: string) => {
    addToast({
      type: "error",
      title: "Payment Failed",
      description: error,
      duration: 5000,
    });
  };

  // Don't render until cart is loaded from localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading EliteCart...</p>
        </div>
      </div>
    );
  }

  // Show order confirmation page
  if (showOrderConfirmation && orderData) {
    return (
      <OrderConfirmation
        orderData={orderData}
        formatPrice={formatPrice}
        onContinueShopping={() => {
          setShowOrderConfirmation(false);
          setOrderData(null);
          scrollToSection("home");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-2 text-sm font-medium">
        🚚 Free delivery across India on orders above ₹999 | 📞 24/7 Customer
        Support
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-orange-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                EliteCart
              </span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <SearchSuggestions
                products={products}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onProductSelect={openProductModal}
              />
            </div>

            {/* Navigation & Icons */}
            <div className="flex items-center space-x-6">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href.substring(1))}
                    className={`font-medium transition-colors hover:text-orange-600 ${
                      activeSection === item.href.substring(1)
                        ? "text-orange-600"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* Mobile Search */}
                    <SearchSuggestions
                      products={products}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      onProductSelect={openProductModal}
                    />

                    {/* Mobile Navigation */}
                    <nav className="space-y-2">
                      {navItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() =>
                            scrollToSection(item.href.substring(1))
                          }
                          className="block w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        >
                          {item.name}
                        </button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-orange-50"
                  onClick={() => {
                    if (isAuthenticated) {
                      setIsProfileOpen(true);
                    } else {
                      setIsLoginOpen(true);
                    }
                  }}
                >
                  {user ? (
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-orange-50"
                  onClick={() => {
                    if (wishlist.length === 0) {
                      addToast({
                        type: "info",
                        title: "Wishlist is Empty",
                        description:
                          "Add some products to your wishlist to see them here.",
                      });
                    } else {
                      addToast({
                        type: "info",
                        title: "Wishlist",
                        description: `You have ${wishlist.length} items in your wishlist.`,
                      });
                    }
                  }}
                >
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-orange-50"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative h-[600px] overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].gradient} transition-all duration-1000`}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="grid md:grid-cols-2 gap-8 items-center w-full">
              <div className="text-white space-y-6 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl text-orange-200">
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    onClick={() => scrollToSection("products")}
                  >
                    Shop Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full font-semibold bg-transparent"
                    onClick={() => scrollToSection("offers")}
                  >
                    Explore Deals
                  </Button>
                </div>
              </div>
              <div className="relative hidden md:block">
                <Image
                  src={heroSlides[currentSlide].image || "/placeholder.svg"}
                  alt="Featured Products"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className={`group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-orange-100 ${
                  selectedCategory === category.name
                    ? "bg-orange-50 border-orange-300"
                    : "bg-gradient-to-br from-white to-orange-50"
                }`}
                onClick={() => {
                  setSelectedCategory(category.name);
                  scrollToSection("products");
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {category.count} items
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section
        id="products"
        className="py-16 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filters Button */}
            <div className="lg:hidden">
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mb-4 bg-transparent"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters & Sort
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FiltersContent
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    clearFilters={clearFilters}
                    formatPrice={formatPrice}
                    brands={brands}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters Sidebar */}
            <div className="lg:w-1/4 hidden lg:block">
              <Card className="sticky top-24 bg-white/80 backdrop-blur-sm border-orange-100">
                <CardContent className="p-6">
                  <FiltersContent
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    inStockOnly={inStockOnly}
                    setInStockOnly={setInStockOnly}
                    clearFilters={clearFilters}
                    formatPrice={formatPrice}
                    brands={brands}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    {filteredProducts.length} Products Found
                  </span>
                  {selectedCategory !== "All" && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-800"
                    >
                      {selectedCategory}
                      <X
                        className="w-3 h-3 ml-1 cursor-pointer"
                        onClick={() => setSelectedCategory("All")}
                      />
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={
                        viewMode === "grid" ? "bg-orange-500 text-white" : ""
                      }
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={
                        viewMode === "list" ? "bg-orange-500 text-white" : ""
                      }
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Top Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    addToCart={addToCart}
                    formatPrice={formatPrice}
                    openProductModal={openProductModal}
                  />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button
                    onClick={clearFilters}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="offers" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-orange-50 border-orange-100"
                onClick={() => openProductModal(product)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      {product.discount}% OFF
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlist.includes(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      size="sm"
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 bg-gradient-to-br from-gray-50 to-blue-50"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-gray-800">
            About EliteCart India
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-8">
              EliteCart India is your premium destination for electronics,
              gadgets, and lifestyle products. We bring you the latest
              technology at unbeatable prices with guaranteed authenticity and
              exceptional customer service.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-semibold mb-2">Free Delivery</h3>
                <p className="text-gray-600">
                  Free shipping across India on orders above ₹999
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  Multiple payment options with bank-level security
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-semibold mb-2">Quality Assured</h3>
                <p className="text-gray-600">
                  100% authentic products with warranty
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Contact Us
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">📞</span>
                  </div>
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">✉️</span>
                  </div>
                  <span>support@elitecart.in</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600">📍</span>
                  </div>
                  <span>Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-6">Customer Support</h3>
              <p className="text-gray-600 mb-4">
                Our customer support team is available 24/7 to help you with any
                queries or concerns.
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                Chat with Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">E</span>
                </div>
                <span className="text-xl font-bold">EliteCart</span>
              </div>
              <p className="text-gray-300 mb-4">
                India's premium shopping destination for electronics, fashion,
                and lifestyle products.
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-orange-400">🇮🇳</span>
                <span className="text-sm">Made in India</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Customer Care</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button className="hover:text-orange-400 transition-colors text-left">
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-400 transition-colors text-left">
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-400 transition-colors text-left">
                    Returns & Refunds
                  </button>
                </li>
                <li>
                  <button
                    className="hover:text-orange-400 transition-colors text-left"
                    onClick={() => scrollToSection("contact")}
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <button
                    className="hover:text-orange-400 transition-colors text-left"
                    onClick={() => scrollToSection("about")}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-400 transition-colors text-left">
                    Careers
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-400 transition-colors text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-400 transition-colors text-left">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                <button className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <span className="text-xs">f</span>
                </button>
                <button className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                  <span className="text-xs">📷</span>
                </button>
                <button className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                  <span className="text-xs">🐦</span>
                </button>
              </div>
              <div className="text-sm text-gray-300">
                <p className="mb-2">Payment Methods:</p>
                <div className="flex space-x-2">
                  <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs">
                    UPI
                  </span>
                  <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs">
                    Visa
                  </span>
                  <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs">
                    RuPay
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-700" />

          <div className="text-center text-gray-400 text-sm">
            <p>
              &copy; 2025 EliteCart India. All rights reserved. | Designed with
              ❤️ for India
            </p>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Sidebar */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-lg bg-white/95 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-800">
              Shopping Cart (
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-4">
                  Add some products to get started!
                </p>
                <Button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto py-4">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-orange-100"
                      >
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm">
                            {item.name}
                          </h4>
                          <p className="text-orange-600 font-semibold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery:</span>
                      <span>
                        {deliveryCharges === 0
                          ? "FREE"
                          : formatPrice(deliveryCharges)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-orange-600">
                        {formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                    </Button>
                    <Button
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutOpen(true);
                      }}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    width={500}
                    height={500}
                    className="w-full rounded-lg object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-1">
                    {selectedProduct.discount}% OFF
                  </Badge>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(selectedProduct.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">
                        ({selectedProduct.reviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(selectedProduct.price)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(selectedProduct.originalPrice)}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-4">
                      {selectedProduct.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {selectedProduct.features?.map(
                          (feature: string, index: number) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              {feature}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setIsProductModalOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3"
                    >
                      Add to Cart
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${
                          wishlist.includes(selectedProduct.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                      {wishlist.includes(selectedProduct.id)
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        cartTotal={cartTotal}
        gst={gst}
        deliveryCharges={deliveryCharges}
        finalTotal={finalTotal}
        formatPrice={formatPrice}
        checkoutStep={checkoutStep}
        setCheckoutStep={setCheckoutStep}
        onOrderPlace={handleOrderPlacement}
      />

      {/* Floating WhatsApp Button */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg animate-pulse"
        onClick={() => {
          addToast({
            type: "info",
            title: "WhatsApp Support",
            description: "WhatsApp support feature coming soon!",
          });
        }}
      >
        <span className="text-2xl">💬</span>
      </Button>

      {/* Authentication Dialogs */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterDialog
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Payment Gateway */}
      {paymentDetails && (
        <PaymentGateway
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          paymentDetails={paymentDetails}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}

      {/* Payment History */}
      <PaymentHistory
        isOpen={isPaymentHistoryOpen}
        onClose={() => setIsPaymentHistoryOpen(false)}
      />
    </div>
  );
}

// Filters Component
function FiltersContent({
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  clearFilters,
  formatPrice,
  brands,
}: any) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-orange-600 hover:text-orange-700"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Price Range
          </Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000}
            min={500}
            step={500}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Brands */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Brands
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map((brand: string) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={brand}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedBrands([...selectedBrands, brand]);
                    } else {
                      setSelectedBrands(
                        selectedBrands.filter((b: string) => b !== brand)
                      );
                    }
                  }}
                />
                <Label htmlFor={brand} className="text-sm text-gray-700">
                  {brand}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Minimum Rating
          </Label>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`rating-${rating}`}
                  name="rating"
                  checked={minRating === rating}
                  onChange={() => setMinRating(rating)}
                  className="text-orange-500"
                />
                <Label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center text-sm text-gray-700"
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-1">& above</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* In Stock */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={inStockOnly}
            onCheckedChange={setInStockOnly}
          />
          <Label htmlFor="inStock" className="text-sm text-gray-700">
            In Stock Only
          </Label>
        </div>
      </div>
    </>
  );
}

// Product Card Component
function ProductCard({
  product,
  viewMode,
  wishlist,
  toggleWishlist,
  addToCart,
  formatPrice,
  openProductModal,
}: any) {
  return (
    <Card
      className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/90 backdrop-blur-sm border-orange-100 ${
        viewMode === "list" ? "flex" : ""
      }`}
      onClick={() => openProductModal(product)}
    >
      <CardContent
        className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}
      >
        <div
          className={viewMode === "list" ? "w-48 flex-shrink-0" : "relative"}
        >
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              viewMode === "list" ? "h-48" : "h-64 rounded-t-lg"
            }`}
          />
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            {product.discount}% OFF
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
          >
            <Heart
              className={`w-4 h-4 ${
                wishlist.includes(product.id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }`}
            />
          </Button>
        </div>

        <div
          className={`p-4 ${
            viewMode === "list" ? "flex-1 flex flex-col justify-between" : ""
          }`}
        >
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviews})
              </span>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
            {viewMode === "list" && (
              <p className="text-sm text-gray-600 mb-3">
                {product.description}
              </p>
            )}
          </div>

          <Button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Checkout Dialog Component
function CheckoutDialog({
  isOpen,
  onClose,
  cartItems,
  cartTotal,
  gst,
  deliveryCharges,
  finalTotal,
  formatPrice,
  checkoutStep,
  setCheckoutStep,
  onOrderPlace,
}: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Checkout
          </DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step <= checkoutStep
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span
                    className={`ml-2 text-sm ${
                      step <= checkoutStep
                        ? "text-orange-600 font-medium"
                        : "text-gray-500"
                    }`}
                  >
                    {step === 1 ? "Address" : step === 2 ? "Payment" : "Review"}
                  </span>
                  {step < 3 && (
                    <div
                      className={`w-16 h-0.5 mx-4 ${
                        step < checkoutStep ? "bg-orange-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <Tabs value={checkoutStep.toString()} className="w-full">
              <TabsContent value="1" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Enter your full name" />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="House No, Building, Street, Area"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input id="pincode" placeholder="6-digit pincode" />
                  </div>
                </div>
                <Button
                  onClick={() => setCheckoutStep(2)}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Continue to Payment
                </Button>
              </TabsContent>

              <TabsContent value="2" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                <RadioGroup defaultValue="upi">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1">
                        <div className="font-medium">UPI Payment</div>
                        <div className="text-sm text-gray-600">
                          PhonePe, Google Pay, Paytm
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1">
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-600">
                          Visa, Mastercard, RuPay
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1">
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-gray-600">
                          Pay when you receive
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex-1">
                        <div className="font-medium">Net Banking</div>
                        <div className="text-sm text-gray-600">
                          All major banks supported
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCheckoutStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCheckoutStep(3)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                  >
                    Review Order
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="3" className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Order Review</h3>
                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCheckoutStep(2)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={onOrderPlace}
                  >
                    Place Order
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  Items (
                  {cartItems.reduce(
                    (sum: number, item: any) => sum + item.quantity,
                    0
                  )}
                  ):
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>{formatPrice(gst)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges:</span>
                <span>
                  {deliveryCharges === 0
                    ? "FREE"
                    : formatPrice(deliveryCharges)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount:</span>
                <span className="text-orange-600">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
            {cartTotal > 99900 && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                🎉 You saved ₹99 on delivery charges!
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function EliteCartIndia() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PaymentProvider>
          <EliteCartIndiaContent />
        </PaymentProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
