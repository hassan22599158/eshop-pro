"use client"

import { ShoppingCart, Search, User, Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface CartItem {
    product_id: number
    name: string
    price: number
    quantity: number
    image: string
}

export default function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems))
  }, [cartItems])

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.product_id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Remove item
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.product_id !== id))
  }

  const handleCheckout = async () => {
    try {
        // Get user from localStorage
        const userStr = localStorage.getItem("user")

        if (!userStr) {
             alert("Please login to checkout.")
             router.push("/auth")
             return
        }

        const user = JSON.parse(userStr)
        const userId = user.id

        // Use StorageService instead of API call
        const { StorageService } = await import("@/lib/storage")

        const success = StorageService.createOrder(
            userId,
            cartItems.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity
            }))
        )

        if (success) {
            alert("Order placed successfully!")
            setCartItems([])
            localStorage.removeItem("cart")
            router.push("/")
        } else {
            alert("Failed to place order. Check stock availability.")
        }
    } catch (error) {
        console.error("Checkout error:", error)
        alert("An error occurred during checkout.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-gray-900">E-Shop Pro</span>
            </Link>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
                <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">
              {/* Search Icon Mobile */}
              <button className="md:hidden text-gray-600 hover:text-blue-600 transition">
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button className="relative text-gray-600 hover:text-blue-600 transition group">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold group-hover:bg-blue-700 transition">
                  {cartItems.length}
                </span>
              </button>

              {/* User Profile */}
              <button className="text-gray-600 hover:text-blue-600 transition">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-8 py-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex gap-6 p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                        <p className="text-2xl font-bold text-blue-600">${item.price.toFixed(2)}</p>
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-blue-600 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-blue-600 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-8">
                <Link
                  href="/"
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2 transition"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-8">Order Summary</h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-t border-gray-300 pt-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-3 transition-all hover:shadow-lg mb-4">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Continue Shopping */}
                <Link href="/">
                  <button className="w-full py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition">
                    Continue Shopping
                  </button>
                </Link>

                {/* Promo Code */}
                <div className="mt-8 pt-8 border-t border-gray-300">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: "Shop",
                links: ["All Products", "Phones", "Laptops", "Accessories"],
              },
              {
                title: "Support",
                links: ["Contact Us", "FAQ", "Shipping Info", "Returns"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Sustainability"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"],
              },
            ].map((column) => (
              <div key={column.title}>
                <h4 className="font-bold text-white mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="hover:text-white transition">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-white">E-Shop Pro</span>
            </div>
            <p className="text-center md:text-right text-sm">
              © 2025 E-Shop Pro. All rights reserved. | Made with ❤️ for tech lovers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
