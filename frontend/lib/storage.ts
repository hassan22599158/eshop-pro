"use client"

// Types
export interface Product {
  id: number
  name: string
  price: number
  description: string
  stock_quantity: number
  image_url: string
  category_id: number
}

export interface User {
  id: number
  email: string
  password_hash: string // In real app, this would be hashed. storing plain for mock.
  full_name: string
  is_admin: boolean
}

export interface Order {
  id: number
  user_id: number
  total_price: number
  status: "Pending" | "Shipped" | "Delivered"
  created_at: string
  items: OrderItem[]
}

export interface OrderItem {
  product_id: number
  quantity: number
  price_at_purchase: number
}

// Keys
const KEYS = {
  USERS: "eshop_users",
  PRODUCTS: "eshop_products",
  ORDERS: "eshop_orders",
  CATEGORIES: "eshop_categories",
  INIT: "eshop_initialized"
}

// Initial Data
const INITIAL_USERS: User[] = [
  {
    id: 1,
    email: "admin@eshop.com",
    password_hash: "admin123", // Plain text for mock demo
    full_name: "Admin User",
    is_admin: true
  }
]

const INITIAL_CATEGORIES = [
  { id: 1, name: "Laptops", slug: "laptops" },
  { id: 2, name: "Phones", slug: "phones" },
  { id: 3, name: "Accessories", slug: "accessories" }
]

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Pro Laptop",
    description: "High performance laptop for professionals.",
    price: 1200.00,
    stock_quantity: 10,
    image_url: "/gaming-laptop-high-performance.jpg",
    category_id: 1
  },
  {
    id: 2,
    name: "Budget Laptop",
    description: "Affordable laptop for students.",
    price: 500.00,
    stock_quantity: 20,
    image_url: "/professional-4k-camera.jpg", // Reusing available images as placeholders
    category_id: 1
  },
  {
    id: 3,
    name: "Smartphone X",
    description: "Latest generation smartphone.",
    price: 800.00,
    stock_quantity: 15,
    image_url: "/smart-watch-fitness-tracker.jpg", // Reusing available images
    category_id: 2
  },
  {
    id: 4,
    name: "Noise Cancelling Headphones",
    description: "Immersive sound experience.",
    price: 150.00,
    stock_quantity: 50,
    image_url: "/wireless-earbuds-premium.jpg",
    category_id: 3
  },
  {
    id: 5,
    name: "Mechanical Keyboard",
    description: "Tactile feedback for gamers.",
    price: 100.00,
    stock_quantity: 30,
    image_url: "/mechanical-gaming-keyboard.jpg",
    category_id: 3
  }
]

// Service
export const StorageService = {
  initialize: () => {
    if (typeof window === "undefined") return;

    if (!localStorage.getItem(KEYS.INIT)) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS))
      localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS))
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES))
      localStorage.setItem(KEYS.ORDERS, JSON.stringify([]))
      localStorage.setItem(KEYS.INIT, "true")
      console.log("Mock DB Initialized")
    }
  },

  getProducts: (): Product[] => {
    if (typeof window === "undefined") return [];
    StorageService.initialize();
    return JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]")
  },

  getProduct: (id: number): Product | undefined => {
    const products = StorageService.getProducts();
    return products.find(p => p.id === id)
  },

  getOrders: (): Order[] => {
    if (typeof window === "undefined") return [];
    StorageService.initialize();
    return JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]")
  },

  createOrder: (userId: number, items: { product_id: number, quantity: number }[]): boolean => {
    StorageService.initialize();
    const products = StorageService.getProducts();
    const orders: Order[] = JSON.parse(localStorage.getItem(KEYS.ORDERS) || "[]");

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    // Validate stock and calculate price
    for (const item of items) {
      const productIndex = products.findIndex(p => p.id === item.product_id);
      if (productIndex === -1) return false;

      const product = products[productIndex];
      if (product.stock_quantity < item.quantity) return false;

      totalPrice += product.price * item.quantity;
      orderItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_purchase: product.price
      });

      // Update stock
      products[productIndex].stock_quantity -= item.quantity;
    }

    // Save updated products
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));

    // Create Order
    const newOrder: Order = {
      id: orders.length + 1,
      user_id: userId,
      total_price: totalPrice,
      status: "Pending",
      created_at: new Date().toISOString(),
      items: orderItems
    };

    orders.push(newOrder);
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    return true;
  },

  login: (email: string, password: string): User | null => {
    StorageService.initialize();
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
    const user = users.find(u => u.email === email && u.password_hash === password);
    return user || null;
  },

  register: (email: string, password: string, fullName: string): User | string => {
    StorageService.initialize();
    const users: User[] = JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");

    if (users.find(u => u.email === email)) {
      return "Email already exists";
    }

    const newUser: User = {
      id: users.length + 1,
      email,
      password_hash: password,
      full_name: fullName,
      is_admin: false
    };

    users.push(newUser);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return newUser;
  }
}
