import { Link } from "react-router-dom";

export default function ProductStrip({ title, products }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <Link
            key={p._id}
            to={`/product/${p._id}`}
            className="shrink-0 w-40 bg-[#171717] border border-[#2C2C2C] rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-colors duration-300"
          >
            <div className="aspect-square bg-[#0D0D0D]">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="text-sm text-white font-medium truncate">{p.name}</p>
              <span className="text-[#D4AF37] font-bold text-xs mt-1 inline-block">
                ₹{p.price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}