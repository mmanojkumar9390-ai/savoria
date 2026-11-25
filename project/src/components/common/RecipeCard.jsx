import { Link } from 'react-router-dom'
import { Clock, Users, Flame, Heart, ChefHat } from 'lucide-react'
import { motion } from 'framer-motion'
import RecipeImage from '../common/RecipeImage'
import RatingStars from '../common/RatingStars'
import { useFavorites } from '../../context/FavoritesContext'
import { useToast } from '../../context/ToastContext'
import { formatTime, getTotalTime, getDifficultyColor, getFoodTypeColor } from '../../utils/helpers'

export default function RecipeCard({ recipe, index = 0 }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const { showToast } = useToast()
  const fav = isFavorite(recipe.id)

  const handleFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(recipe)
    showToast(fav ? 'Removed from favorites' : 'Added to favorites!', fav ? 'info' : 'success')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to={`/recipes/${recipe.id}`}
        className="group block bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <RecipeImage recipe={recipe} size="lg" className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${getFoodTypeColor(recipe.foodType)}`}>
              {recipe.foodType === 'vegetarian' ? '🟢 Veg' : '🔴 Non-Veg'}
            </span>
          </div>
          <button
            onClick={handleFav}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
              fav ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={fav ? 'currentColor' : 'none'} />
          </button>
          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[11px] font-medium flex items-center gap-1">
            <Flame size={12} /> {recipe.cuisine}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <RatingStars rating={recipe.rating} size={14} showNumber reviews={recipe.reviews} />
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          <h3 className="font-display text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{recipe.description}</p>

          <div className="flex items-center gap-4 pt-2 border-t border-cream-100 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-orange-400" />
              {formatTime(getTotalTime(recipe))}
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-orange-400" />
              {recipe.servings} servings
            </span>
            <span className="flex items-center gap-1.5 ml-auto text-orange-500 font-medium group-hover:gap-2.5 transition-all">
              <ChefHat size={14} />
              Cook
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
