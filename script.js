// --- DATA & STATE ---

const INITIAL_USERS = [
    { id: 1, email: "admin@eshop.com", password: "admin123", full_name: "Admin User", is_admin: true }
];

const INITIAL_PRODUCTS = [
    { id: 1, name: "Pro Laptop", price: 1200.00, description: "High performance laptop for professionals.", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.8, reviews: 124 },
    { id: 2, name: "Budget Laptop", price: 500.00, description: "Affordable laptop for students.", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.2, reviews: 89 },
    { id: 3, name: "Smartphone X", price: 800.00, description: "Latest generation smartphone.", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.9, reviews: 256 },
    { id: 4, name: "Headphones", price: 150.00, description: "Noise cancelling immersive sound.", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.5, reviews: 45 },
    { id: 5, name: "Mechanical Keyboard", price: 100.00, description: "Tactile feedback for gamers.", image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.7, reviews: 34 },
    { id: 6, name: "Smart Watch", price: 299.99, description: "Track your fitness goals.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", rating: 4.6, reviews: 112 }
];

// LocalStorage Keys
const KEYS = { USERS: 'users', PRODUCTS: 'products', ORDERS: 'orders', CART: 'cart', CURRENT_USER: 'currentUser', INIT: 'initialized' };

// Initialize Data
function initData() {
    if (!localStorage.getItem(KEYS.INIT)) {
        localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
        localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
        localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
        localStorage.setItem(KEYS.CART, JSON.stringify([]));
        localStorage.setItem(KEYS.INIT, 'true');
    }
}

// Helpers
const getLS = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const getCurrentUser = () => JSON.parse(localStorage.getItem(KEYS.CURRENT_USER));

// --- ROUTER ---

function navigate(view, param = null) {
    window.location.hash = param ? `#${view}/${param}` : `#${view}`;
    render();
}

function render() {
    const app = document.getElementById('app');
    const hash = window.location.hash.slice(1) || 'home';
    const parts = hash.split('/');
    const view = parts[0];
    const param = parts[1];

    updateHeader();

    if (view === 'home') renderHome(app);
    else if (view === 'product') renderProduct(app, param);
    else if (view === 'cart') renderCart(app);
    else if (view === 'login') renderLogin(app);
    else if (view === 'register') renderRegister(app);
    else if (view === 'admin') renderAdmin(app);
    else renderHome(app);

    window.scrollTo(0,0);
}

function updateHeader() {
    const cart = getLS(KEYS.CART);
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;

    const user = getCurrentUser();
    const logoutBtn = document.getElementById('logout-btn');
    if (user) {
        logoutBtn.classList.remove('hidden');
    } else {
        logoutBtn.classList.add('hidden');
    }
}

function checkAuthAndNavigate() {
    const user = getCurrentUser();
    if (user) {
        if (user.is_admin) navigate('admin');
        else navigate('home'); // Or profile
    } else {
        navigate('login');
    }
}

function logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
    navigate('home');
}

// --- VIEWS ---

// 1. HOME VIEW
function renderHome(container) {
    const products = getLS(KEYS.PRODUCTS);

    const hero = `
    <section class="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white overflow-hidden mb-12">
        <div class="max-w-7xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
            <div class="space-y-6">
                <h1 class="text-4xl md:text-5xl font-bold leading-tight">Upgrade Your Tech</h1>
                <p class="text-lg md:text-xl text-blue-100">Premium quality electronics at unbeatable prices.</p>
                <button onclick="document.getElementById('products').scrollIntoView({behavior: 'smooth'})" class="bg-white text-blue-600 font-semibold rounded-lg px-8 py-4 hover:bg-gray-100 transition">Shop Now</button>
            </div>
            <div class="hidden md:block">
                <img src="https://images.unsplash.com/photo-1498049381960-a0d918c75dd9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Tech" class="rounded-2xl shadow-2xl">
            </div>
        </div>
    </section>
    `;

    const grid = `
    <section id="products" class="max-w-7xl mx-auto px-4 pb-16">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            ${products.map(p => `
                <div class="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group cursor-pointer" onclick="navigate('product', ${p.id})">
                    <div class="h-64 overflow-hidden bg-gray-100">
                        <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-300">
                    </div>
                    <div class="p-6">
                        <div class="flex items-center gap-1 mb-2 text-yellow-400 text-sm">
                            ${Array(5).fill('<i class="fa-solid fa-star"></i>').join('')} <span class="text-gray-400 ml-1">(${p.reviews})</span>
                        </div>
                        <h3 class="font-bold text-lg mb-2">${p.name}</h3>
                        <p class="text-2xl font-bold text-blue-600">$${p.price.toFixed(2)}</p>
                        <button class="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition">View Details</button>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>
    `;

    container.innerHTML = hero + grid;
}

// 2. PRODUCT DETAILS VIEW
function renderProduct(container, id) {
    const products = getLS(KEYS.PRODUCTS);
    const product = products.find(p => p.id == id);

    if (!product) {
        container.innerHTML = '<div class="p-12 text-center">Product not found. <br> <a onclick="navigate(\'home\')" class="text-blue-600 cursor-pointer">Back to Home</a></div>';
        return;
    }

    container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <a onclick="navigate('home')" class="text-gray-500 hover:text-blue-600 mb-8 inline-block cursor-pointer"><i class="fa-solid fa-arrow-left mr-2"></i> Back to Products</a>
        <div class="grid md:grid-cols-2 gap-12">
            <div class="bg-gray-100 rounded-2xl overflow-hidden">
                <img src="${product.image}" class="w-full h-full object-cover">
            </div>
            <div>
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${product.name}</h1>
                <div class="flex items-center gap-2 mb-6">
                    <div class="flex text-yellow-400">${Array(5).fill('<i class="fa-solid fa-star"></i>').join('')}</div>
                    <span class="text-gray-500">(${product.reviews} reviews)</span>
                </div>
                <p class="text-4xl font-bold text-blue-600 mb-6">$${product.price.toFixed(2)}</p>
                <p class="text-gray-600 text-lg mb-8 leading-relaxed">${product.description}</p>

                <div class="flex items-center gap-4">
                    <div class="flex items-center border rounded-lg">
                        <button class="px-4 py-3 hover:bg-gray-100" onclick="updateQty(-1)"><i class="fa-solid fa-minus"></i></button>
                        <span id="qty" class="px-4 font-bold">1</span>
                        <button class="px-4 py-3 hover:bg-gray-100" onclick="updateQty(1)"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <button onclick="addToCart(${product.id})" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
                        <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Attach helper to window for onclick access in this scope
    window.currentQty = 1;
    window.updateQty = (change) => {
        let q = window.currentQty + change;
        if (q < 1) q = 1;
        window.currentQty = q;
        document.getElementById('qty').innerText = q;
    };

    window.addToCart = (pid) => {
        const cart = getLS(KEYS.CART);
        const existing = cart.find(item => item.product_id == pid);
        if (existing) {
            existing.quantity += window.currentQty;
        } else {
            const p = getLS(KEYS.PRODUCTS).find(x => x.id == pid);
            cart.push({ product_id: pid, name: p.name, price: p.price, image: p.image, quantity: window.currentQty });
        }
        setLS(KEYS.CART, cart);
        alert('Added to cart!');
        updateHeader();
    };
}

// 3. CART VIEW
function renderCart(container) {
    const cart = getLS(KEYS.CART);

    if (cart.length === 0) {
        container.innerHTML = `
        <div class="text-center py-20">
            <i class="fa-solid fa-cart-shopping text-6xl text-gray-300 mb-4"></i>
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <button onclick="navigate('home')" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">Start Shopping</button>
        </div>
        `;
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = total * 0.1;

    container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-4">
                ${cart.map((item, idx) => `
                    <div class="flex gap-4 p-4 bg-white border rounded-xl shadow-sm">
                        <img src="${item.image}" class="w-24 h-24 object-cover rounded-lg bg-gray-100">
                        <div class="flex-1 flex flex-col justify-between">
                            <div class="flex justify-between">
                                <h3 class="font-bold text-lg">${item.name}</h3>
                                <p class="font-bold text-blue-600">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div class="flex items-center justify-between mt-2">
                                <div class="text-gray-600 text-sm">$${item.price} each</div>
                                <div class="flex items-center gap-3">
                                    <span class="font-semibold">Qty: ${item.quantity}</span>
                                    <button onclick="removeItem(${idx})" class="text-red-500 hover:bg-red-50 p-2 rounded"><i class="fa-solid fa-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="lg:col-span-1">
                <div class="bg-gray-50 p-6 rounded-xl border">
                    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
                    <div class="space-y-3 mb-6 border-b pb-4">
                        <div class="flex justify-between"><span>Subtotal</span><span>$${total.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span>Tax (10%)</span><span>$${tax.toFixed(2)}</span></div>
                    </div>
                    <div class="flex justify-between text-xl font-bold mb-6">
                        <span>Total</span><span>$${(total + tax).toFixed(2)}</span>
                    </div>
                    <button onclick="checkout()" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    </div>
    `;

    window.removeItem = (idx) => {
        cart.splice(idx, 1);
        setLS(KEYS.CART, cart);
        renderCart(container);
        updateHeader();
    };

    window.checkout = () => {
        const user = getCurrentUser();
        if (!user) {
            alert('Please login to checkout.');
            navigate('login');
            return;
        }

        // Create Order
        const orders = getLS(KEYS.ORDERS);
        const newOrder = {
            id: orders.length + 1,
            user_id: user.id,
            user_name: user.full_name,
            total_price: total + tax,
            status: 'Pending',
            created_at: new Date().toLocaleDateString(),
            items: cart
        };
        orders.push(newOrder);
        setLS(KEYS.ORDERS, orders);

        // Clear Cart
        setLS(KEYS.CART, []);
        alert('Order placed successfully!');
        navigate('home');
    };
}

// 4. AUTH VIEWS
function renderLogin(container) {
    container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border">
            <h2 class="text-2xl font-bold text-center mb-6">Welcome Back</h2>
            <form onsubmit="handleLogin(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 mb-4">Sign In</button>
            </form>
            <p class="text-center text-sm text-gray-600">Don't have an account? <a onclick="navigate('register')" class="text-blue-600 font-semibold cursor-pointer">Sign Up</a></p>
            <div class="mt-6 p-4 bg-yellow-50 text-xs text-yellow-800 rounded">
                <strong>Demo Accounts:</strong><br>
                User: admin@eshop.com / admin123
            </div>
        </div>
    </div>
    `;

    window.handleLogin = (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        const users = getLS(KEYS.USERS);
        const user = users.find(u => u.email === email && u.password === pass);

        if (user) {
            setLS(KEYS.CURRENT_USER, user);
            alert('Login successful');
            if (user.is_admin) navigate('admin');
            else navigate('home');
        } else {
            alert('Invalid credentials');
        }
    };
}

function renderRegister(container) {
    container.innerHTML = `
    <div class="min-h-[80vh] flex items-center justify-center px-4">
        <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border">
            <h2 class="text-2xl font-bold text-center mb-6">Create Account</h2>
            <form onsubmit="handleRegister(event)">
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" id="reg-name" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <div class="mb-4">
                    <label class="block text-sm font-medium mb-1">Email</label>
                    <input type="email" id="reg-email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <div class="mb-6">
                    <label class="block text-sm font-medium mb-1">Password</label>
                    <input type="password" id="reg-pass" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 mb-4">Sign Up</button>
            </form>
            <p class="text-center text-sm text-gray-600">Already have an account? <a onclick="navigate('login')" class="text-blue-600 font-semibold cursor-pointer">Sign In</a></p>
        </div>
    </div>
    `;

    window.handleRegister = (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-pass').value;

        const users = getLS(KEYS.USERS);
        if (users.find(u => u.email === email)) {
            alert('Email already registered');
            return;
        }

        const newUser = { id: users.length + 1, email, password: pass, full_name: name, is_admin: false };
        users.push(newUser);
        setLS(KEYS.USERS, users);
        alert('Account created! Please log in.');
        navigate('login');
    };
}

// 5. ADMIN VIEW
function renderAdmin(container) {
    const user = getCurrentUser();
    if (!user || !user.is_admin) {
        navigate('home');
        return;
    }

    const orders = getLS(KEYS.ORDERS);

    container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="text-gray-500 text-sm font-medium mb-1">Total Orders</div>
                <div class="text-3xl font-bold">${orders.length}</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="text-gray-500 text-sm font-medium mb-1">Total Revenue</div>
                <div class="text-3xl font-bold text-green-600">$${orders.reduce((acc, o) => acc + o.total_price, 0).toFixed(2)}</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border">
                <div class="text-gray-500 text-sm font-medium mb-1">Pending Orders</div>
                <div class="text-3xl font-bold text-orange-500">${orders.filter(o => o.status === 'Pending').length}</div>
            </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div class="px-6 py-4 border-b font-bold">Recent Orders</div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50 text-sm text-gray-600 uppercase">
                        <tr>
                            <th class="px-6 py-3">Order ID</th>
                            <th class="px-6 py-3">Customer</th>
                            <th class="px-6 py-3">Date</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3 text-right">Total</th>
                            <th class="px-6 py-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${orders.length === 0 ? '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No orders found</td></tr>' :
                        orders.map(order => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 font-medium">#${order.id}</td>
                                <td class="px-6 py-4">${order.user_name}</td>
                                <td class="px-6 py-4 text-sm text-gray-500">${order.created_at}</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 text-xs rounded-full ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}">
                                        ${order.status}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right font-bold">$${order.total_price.toFixed(2)}</td>
                                <td class="px-6 py-4 text-center">
                                    <button onclick="toggleStatus(${order.id})" class="text-blue-600 hover:underline text-sm">Change Status</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `;

    window.toggleStatus = (oid) => {
        const o = orders.find(x => x.id == oid);
        o.status = o.status === 'Pending' ? 'Shipped' : 'Pending';
        setLS(KEYS.ORDERS, orders);
        renderAdmin(container);
    };
}

// --- INIT ---
window.addEventListener('load', () => {
    initData();
    window.addEventListener('hashchange', render);
    render();
});
