import "./ProductCard.css";
import Image from "next/image";

type Product = {
  id: number;
  product_name: string;
  product_image: string;
  product_seller: string;
  seller_image: string;
  price: number;
  created_at: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <Image
        src={product.product_image}
        alt={product.product_name}
        className="product-image"
        width={100}
        height={100}
      />
      <h3 className="product-name">{product.product_name}</h3>
      <p className="product-price">${product.price}</p>
    </div>
  );
}