import ProductDetails from "@/components/product-details"

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  return <ProductDetails productId={params.id} />
}
