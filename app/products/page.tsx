import ProductCard from "../components/ProductCard";

const sampleProducts = [
  {
    id: "1",
    name: "Cool T-Shirt",
    price: 19.99,
    image: "/images/art1.jpg",
  },
  {
    id: "2",
    name: "Running Shoes",
    price: 49.99,
    image: "/images/art2.jpg",
  },
];

export default function ProductsPage() {
  return (
    <div style={gridStyle}>
      {sampleProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "20px",
  padding: "30px",
  backgroundColor: "#f9f9f9",
};
