export default function SkeletonLoader({ type = 'card', count = 6 }) {
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 animate-pulse">
      <div className="h-48 bg-cream-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-cream-200 rounded w-1/3" />
        <div className="h-6 bg-cream-200 rounded w-3/4" />
        <div className="h-4 bg-cream-200 rounded w-full" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-cream-200 rounded-lg w-20" />
          <div className="h-8 bg-cream-200 rounded-lg w-20" />
        </div>
      </div>
    </div>
  )

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (type === 'detail') {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-cream-200 rounded w-1/2" />
        <div className="h-64 bg-cream-200 rounded-3xl" />
        <div className="h-4 bg-cream-200 rounded w-full" />
        <div className="h-4 bg-cream-200 rounded w-3/4" />
      </div>
    )
  }

  return <SkeletonCard />
}
