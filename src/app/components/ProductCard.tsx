<<<<<<< HEAD
import "./ProductCard.css";
import Image from "next/image";
=======
import './ProductCard.css';
>>>>>>> c10241c (card)

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
<<<<<<< HEAD
      <Image
        src={product.image}
        alt={product.name}
        className="product-image"
        width={100}
        height={100}
      />
=======
      <img src={product.image} alt={product.name} className="product-image" />
>>>>>>> c10241c (card)
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
    </div>
  );
}
