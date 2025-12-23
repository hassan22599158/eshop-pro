"use client"

import { ShoppingCart, Search, User, Star, Truck, Clock, Lock, Minus, Plus, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StorageService, Product } from "@/lib/storage"

export default function ProductDetails({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [isFavorite, setIsFavorite] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const router = useRouter()

  useEffect(() => {
    const id = parseInt(productId)
    if (!isNaN(id)) {
      const foundProduct = StorageService.getProduct(id)
      setProduct(foundProduct || null)
    }
  }, [productId])

  const addToCart = () => {
    // In a real app, this would add to a context or sending to an API.
    // For now, let's just create an order directly for simplicity or store in local storage.
    // However, the requirements say "Add to Cart & Checkout (creates an Order in DB)".
    // The Checkout process usually takes items from Cart.
    // I'll simulate adding to cart by saving to localStorage so the Cart page can read it.

    const cartItem = {
        product_id: product?.id,
        quantity: quantity,
        price: product?.price,
        name: product?.name,
        image: product?.image_url
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]")
    // Check if exists
    const existingItemIndex = existingCart.findIndex((item: any) => item.product_id === cartItem.product_id)
    if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += quantity
    } else {
        existingCart.push(cartItem)
    }
    localStorage.setItem("cart", JSON.stringify(existingCart))
    router.push("/cart")
  }

  if (!product) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1))

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="font-bold text-xl text-gray-900">E-Shop Pro</span>
            </Link>

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

            <div className="flex items-center gap-6">
              <button className="md:hidden text-gray-600 hover:text-blue-600 transition">
                <Search className="w-5 h-5" />
              </button>

              <button className="relative text-gray-600 hover:text-blue-600 transition group">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  1
                </span>
              </button>

              <button className="text-gray-600 hover:text-blue-600 transition">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-blue-600 transition">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Image */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-96 md:h-full flex items-center justify-center">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  4.5 (100 reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.stock_quantity > 0 ? (
                  <p className="text-green-600 font-semibold flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                    In Stock ({product.stock_quantity})
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}
              </div>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button onClick={decrementQuantity} className="p-3 hover:bg-gray-100 transition">
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-6 py-3 font-semibold text-gray-900 border-l border-r border-gray-200">
                    {quantity}
                  </span>
                  <button onClick={incrementQuantity} className="p-3 hover:bg-gray-100 transition">
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              <Button
                onClick={addToCart}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-4 text-lg transition-all hover:shadow-lg flex items-center justify-center gap-2"
                disabled={product.stock_quantity < 1}
              >
                <ShoppingCart className="w-6 h-6" />
                Add to Cart
              </Button>

              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-full border-2 border-gray-200 text-gray-700 font-bold rounded-lg py-3 transition-all hover:border-blue-600 hover:text-blue-600 flex items-center justify-center gap-2"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-current text-red-500" : ""}`} />
                {isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-200">
              {[
                { icon: Truck, label: "Free Shipping" },
                { icon: Clock, label: "Fast Delivery" },
                { icon: Lock, label: "Secure Pay" },
              ].map((signal, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <signal.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600 text-center font-medium">{signal.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === "description"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-4 px-2 font-semibold border-b-2 transition ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === "description" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                <p>No reviews yet.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
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
