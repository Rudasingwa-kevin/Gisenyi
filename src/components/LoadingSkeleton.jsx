export const CardSkeleton = () => (
  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 animate-shimmer relative">
    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
    <div className="absolute bottom-6 left-6 right-6 space-y-3">
      <div className="w-20 h-6 rounded-full bg-white/10 animate-shimmer" />
      <div className="w-full h-8 rounded-lg bg-white/10 animate-shimmer" />
      <div className="w-3/4 h-4 rounded-lg bg-white/10 animate-shimmer" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="h-screen flex items-center justify-center bg-navy-900">
    <div className="text-center space-y-6">
      <div className="w-48 h-6 rounded-full bg-white/5 animate-shimmer mx-auto" />
      <div className="w-96 h-24 rounded-2xl bg-white/5 animate-shimmer mx-auto" />
      <div className="w-64 h-6 rounded-lg bg-white/5 animate-shimmer mx-auto" />
    </div>
  </div>
);

export const SkeletonCard = CardSkeleton;
