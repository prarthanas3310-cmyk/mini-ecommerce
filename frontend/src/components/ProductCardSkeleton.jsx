export default function ProductCardSkeleton() {
  return (
    <div className="bg-[#171717] border border-[#2C2C2C] rounded-2xl overflow-hidden flex flex-col">
      <div className="aspect-[4/3] w-full bg-[#2C2C2C] animate-pulse" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-16 rounded bg-[#2C2C2C] animate-pulse" />
        <div className="h-5 w-3/4 rounded bg-[#2C2C2C] animate-pulse" />
        <div className="h-5 w-1/3 rounded bg-[#2C2C2C] animate-pulse" />
      </div>
    </div>
  );
}