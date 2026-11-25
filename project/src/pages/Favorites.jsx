import { Link } from 'react-router-dom'
import { Heart, ArrowRight, Trash2, ChefHat } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import EmptyState from '../components/common/EmptyState'
import RecipeImage from '../components/common/RecipeImage'
import RatingStars from '../components/common/RatingStars'
import { formatTime, getTotalTime } from '../utils/helpers'

export default function Favorites() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { showToast } = useToast()

  const handleRemove = (id, title) => {
    removeFavorite(id)
    showToast(`Removed "${title}" from favorites`, 'info')
  }

  const handleClear = () => {
    clearFavorites()
    showToast('All favorites cleared', 'info')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-gray-800 flex items-center gap-3">
            <Heart className="text-orange-500 fill-orange-500" /> My Favorites
          </h1>
          <p className="text-gray-500 mt-2">
            {favorites.length === 0 ? 'No saved recipes yet' : `${favorites.length} saved ${favorites.length === 1 ? 'recipe' : 'recipes'}`}
          </p>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon="💔"
          title="No Favorites Yet"
          message="Start exploring recipes and tap the heart icon to save your favorites here."
          actionLabel="Explore Recipes"
          onAction={() => (window.location.href = '/recipes')}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {favorites.map((recipe, i) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 hover:shadow-lg transition-all"
              >
                <Link to={`/recipes/${recipe.id}`}>
                  <div className="relative h-44 overflow-hidden">
                    <RecipeImage recipe={recipe} size="lg" className="w-full h-full group-hover:scale-105 transition-transform" />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/40 backdrop-blur-md text-white">
                      {recipe.cuisine}
                    </span>
                  </div>
                </Link>
                <div className="p-5 space-y-3">
                  <RatingStars rating={recipe.rating} size={14} showNumber />
                  <Link to={`/recipes/${recipe.id}`}>
                    <h3 className="font-display text-lg font-bold text-gray-800 hover:text-orange-600 transition-colors line-clamp-1">
                      {recipe.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-cream-100">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <ChefHat size={14} className="text-orange-400" /> {formatTime(getTotalTime(recipe))}
                    </span>
                    <button
                      onClick={() => handleRemove(recipe.id, recipe.title)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-xs font-medium hover:bg-red-100"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
