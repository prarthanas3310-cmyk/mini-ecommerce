export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="aspect-[4/3] w-full skeleton" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 rounded skeleton" />
        <div className="h-5 w-3/4 rounded skeleton" />
        <div className="h-5 w-1/3 rounded skeleton" />
      </div>
    </div>
  );
}
