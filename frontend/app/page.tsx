"use client"

import {
  ShoppingCart,
  Search,
  User,
  Smartphone,
  Laptop,
  Headphones,
  Star,
  Truck,
  Clock,
  Lock,
  ArrowRight,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"

interface Product {
  id: number
  name: string
  price: number
  image_url: string
  description: string
  rating?: number
  reviews?: number
}

export default function HomePage() {
  const [email, setEmail] = useState("")
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products:", err))
  }, [])

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
                  0
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Upgrade Your Tech
              </h1>
              <p className="text-lg md:text-xl text-blue-100 text-pretty">
                Discover the latest in electronics and gadgets. Premium quality, unbeatable prices, and instant
                delivery.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg px-8 py-6 text-base transition-all hover:shadow-lg hover:scale-105 w-full sm:w-auto"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="font-bold text-2xl">50K+</p>
                  <p className="text-blue-100">Happy Customers</p>
                </div>
                <div>
                  <p className="font-bold text-2xl">10K+</p>
                  <p className="text-blue-100">Products</p>
                </div>
              </div>
            </div>

            {/* Right Banner Image */}
            <div className="hidden md:block">
              <img
                src="/modern-electronics-tech-gadgets.jpg"
                alt="Featured electronics"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Shop by Category</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { name: "Phones", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
            { name: "Laptops", icon: Laptop, color: "bg-purple-100 text-purple-600" },
            { name: "Accessories", icon: Headphones, color: "bg-amber-100 text-amber-600" },
          ].map((category) => (
            <button
              key={category.name}
              className="group flex flex-col items-center gap-4 p-8 rounded-2xl hover:shadow-lg transition-all hover:scale-105"
            >
              <div className={`${category.color} p-6 rounded-full group-hover:scale-110 transition-transform`}>
                <category.icon className="w-8 h-8" />
              </div>
              <p className="font-semibold text-gray-900 text-lg">{category.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 group cursor-pointer block"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-gray-100 h-56">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Sale Badge - Optional logic */}
                {/* <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Sale
                </div> */}
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Rating - Mock data since backend doesn't have it yet */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    4.5 (100)
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 transition-all hover:shadow-lg">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "On orders over $50. Fast delivery to your doorstep.",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Our dedicated team is always ready to help you.",
              },
              {
                icon: Lock,
                title: "Secure Payment",
                description: "100% safe and encrypted checkout process.",
              },
            ].map((signal, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl hover:bg-gray-50 transition"
              >
                <div className="bg-blue-100 p-4 rounded-full">
                  <signal.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{signal.title}</h3>
                <p className="text-gray-600 text-sm">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-blue-100 mb-8">
            Subscribe to get special offers and the latest tech news delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-blue-600 hover:bg-gray-100 font-semibold rounded-lg px-8 py-3 transition-all hover:shadow-lg">
              <Mail className="w-5 h-5 mr-2" />
              Subscribe
            </Button>
          </div>
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
