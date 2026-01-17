

import { Link } from "react-router-dom";

export default function SearchResults({ results }) {
  if (!results || results.length === 0) {
    return <p>No products found.</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {results.map((product) => (
        <div
          key={product._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            width: "200px",
          }}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: "100%", height: "150px", objectFit: "cover" }}
          />
          <h4>{product.name}</h4>
          <p>${product.price}</p>
          <Link to={`/products/${product._id}`}>View</Link>
        </div>
      ))}
    </div>
  );
}
