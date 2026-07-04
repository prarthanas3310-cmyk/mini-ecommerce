import { Link } from "react-router-dom";

export default function ProductStrip({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="font-display text-lg font-medium text-ink mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="card shrink-0 w-40 overflow-hidden hover:-translate-y-1 transition-transform"
          >
            <div className="aspect-square bg-teal-50">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5">
              <p className="text-sm text-ink font-medium truncate">{p.name}</p>
              <span className="price-tag mt-1 text-xs">₹{p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
