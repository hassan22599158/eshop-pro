import { Suspense } from "react"
import CartContent from "@/components/cart-content"

export default function CartPage() {
  return (
    <Suspense fallback={null}>
      <CartContent />
    </Suspense>
  )
}
