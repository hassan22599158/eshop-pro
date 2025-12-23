from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database
from passlib.context import CryptContext

# --- Init ---
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# --- CORS ---
origins = [
    "http://localhost:3000", # Next.js default
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependency ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Utils ---
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- Seeding ---
def seed_data(db: Session):
    # Check if admin exists
    admin = db.query(models.User).filter(models.User.email == "admin@eshop.com").first()
    if not admin:
        admin_user = models.User(
            email="admin@eshop.com",
            password_hash=get_password_hash("admin123"),
            full_name="Admin User",
            is_admin=True
        )
        db.add(admin_user)
        db.commit()

    # Categories
    categories = ["Laptops", "Phones", "Accessories"]
    for cat_name in categories:
        if not db.query(models.Category).filter(models.Category.name == cat_name).first():
            db.add(models.Category(name=cat_name, slug=cat_name.lower()))
    db.commit()

    # Products
    if db.query(models.Product).count() == 0:
        laptop_cat = db.query(models.Category).filter(models.Category.name == "Laptops").first()
        phone_cat = db.query(models.Category).filter(models.Category.name == "Phones").first()
        acc_cat = db.query(models.Category).filter(models.Category.name == "Accessories").first()

        products = [
            models.Product(name="Pro Laptop", description="High performance laptop", price=1200.00, stock_quantity=10, image_url="https://via.placeholder.com/300?text=Laptop", category_id=laptop_cat.id),
            models.Product(name="Budget Laptop", description="Good for students", price=500.00, stock_quantity=20, image_url="https://via.placeholder.com/300?text=Budget+Laptop", category_id=laptop_cat.id),
            models.Product(name="Smartphone X", description="Latest model", price=800.00, stock_quantity=15, image_url="https://via.placeholder.com/300?text=Phone", category_id=phone_cat.id),
            models.Product(name="Headphones", description="Noise cancelling", price=150.00, stock_quantity=50, image_url="https://via.placeholder.com/300?text=Headphones", category_id=acc_cat.id),
            models.Product(name="USB-C Cable", description="Fast charging", price=15.00, stock_quantity=100, image_url="https://via.placeholder.com/300?text=Cable", category_id=acc_cat.id),
        ]
        db.add_all(products)
        db.commit()

@app.on_event("startup")
def on_startup():
    db = database.SessionLocal()
    seed_data(db)
    db.close()


# --- Endpoints ---

@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = models.User(email=user.email, password_hash=hashed_password, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Simple mock token/session
    return {"message": "Login successful", "user_id": db_user.id, "email": db_user.email, "is_admin": db_user.is_admin}

@app.get("/api/products", response_model=List[schemas.Product])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

@app.get("/api/products/{product_id}", response_model=schemas.Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Mock current user for simplicity in this exercise, or pass user_id in body
@app.post("/api/orders", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # In a real app, get user from token. Here we rely on the frontend passing the user_id.
    user_id = order.user_id

    # Verify user exists
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
         raise HTTPException(status_code=404, detail="User not found")

    total_price = 0
    db_items = []

    for item in order.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

        price = product.price * item.quantity
        total_price += price

        db_item = models.OrderItem(product_id=item.product_id, quantity=item.quantity, price_at_purchase=product.price)
        db_items.append(db_item)

        # Update stock
        product.stock_quantity -= item.quantity

    new_order = models.Order(user_id=user_id, total_price=total_price, status=models.OrderStatus.PENDING)
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item in db_items:
        item.order_id = new_order.id
        db.add(item)

    db.commit()
    db.refresh(new_order)
    return new_order

@app.get("/api/admin/orders", response_model=List[schemas.Order])
def get_admin_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()
