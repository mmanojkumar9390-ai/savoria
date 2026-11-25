import { Star } from 'lucide-react'

export default function RatingStars({ rating, size = 16, showNumber = false, reviews = null }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          const isFull = i < fullStars
          const isHalf = i === fullStars && hasHalf
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              <Star size={size} className="absolute inset-0 text-gray-300" fill="currentColor" />
              {(isFull || isHalf) && (
                <div className="absolute inset-0 overflow-hidden" style={{ width: isHalf ? size / 2 : size }}>
                  <Star size={size} className="text-orange-400" fill="currentColor" />
                </div>
              )}
            </div>
          )
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
      {reviews !== null && (
        <span className="text-xs text-gray-500">({reviews})</span>
      )}
    </div>
  )
}
