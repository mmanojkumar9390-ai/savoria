import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Clock, Users, Flame, ChefHat, Heart, Share2, Printer, Minus, Plus,
  CheckCircle, Circle, ArrowLeft, ArrowRight, Timer, Star, UtensilsCrossed
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { recipeService } from '../services/api'
import RecipeImage from '../components/common/RecipeImage'
import RatingStars from '../components/common/RatingStars'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import RecipeCard from '../components/common/RecipeCard'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import {
  formatTime, getTotalTime, getDifficultyColor, getFoodTypeColor,
  adjustIngredients, shareRecipe
} from '../utils/helpers'

export default function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { isFavorite, toggleFavorite } = useFavorites()

  const [recipe, setRecipe] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState(4)
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [activeTab, setActiveTab] = useState('ingredients')

  useEffect(() => {
    setLoading(true)
    setRecipe(null)
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setCheckedIngredients(new Set())
    recipeService.getRecipeById(id).then(r => {
      setRecipe(r)
      if (r) setServings(r.servings)
      setLoading(false)
      if (r) recipeService.getRelatedRecipes(r.id).then(setRelated)
    })
  }, [id])

  const adjustedIngredients = useMemo(() => {
    if (!recipe) return []
    return adjustIngredients(recipe.ingredients, recipe.servings, servings)
  }, [recipe, servings])

  if (loading) return <LoadingSpinner fullPage text="Loading recipe..." />
  if (!recipe) return <EmptyState icon="🍳" title="Recipe Not Found" message="The recipe you're looking for doesn't exist." actionLabel="Browse Recipes" onAction={() => navigate('/recipes')} />

  const fav = isFavorite(recipe.id)
  const totalTime = getTotalTime(recipe)
  const progress = (completedSteps.size / recipe.instructions.length) * 100

  const handleFav = () => {
    toggleFavorite(recipe)
    showToast(fav ? 'Removed from favorites' : 'Added to favorites!', fav ? 'info' : 'success')
  }

  const handleShare = () => {
    shareRecipe(recipe)
    showToast('Recipe link copied to clipboard!', 'success')
  }

  const handlePrint = () => window.print()

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  const toggleStep = (idx) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <span>/</span>
        <Link to="/recipes" className="hover:text-orange-500">Recipes</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium truncate">{recipe.title}</span>
      </div>

      {/* Header Section */}
      <div className="grid lg:grid-cols-2 gap-10 mb-10">
        {/* Image */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <RecipeImage recipe={recipe} size="xl" className="w-full aspect-[4/3] shadow-xl" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-md ${getFoodTypeColor(recipe.foodType)}`}>
              {recipe.foodType === 'vegetarian' ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-md text-white border border-white/20">
              {recipe.cuisine}
            </span>
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
          <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">{recipe.category}</span>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-800 mt-2 mb-4">{recipe.title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">{recipe.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <RatingStars rating={recipe.rating} size={20} showNumber reviews={recipe.reviews} />
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Time & Servings */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-cream-100 rounded-2xl p-4 text-center">
              <Clock className="text-orange-500 mx-auto mb-2" size={22} />
              <p className="text-xs text-gray-500">Prep Time</p>
              <p className="font-bold text-gray-800">{formatTime(recipe.prepTime)}</p>
            </div>
            <div className="bg-cream-100 rounded-2xl p-4 text-center">
              <Flame className="text-orange-500 mx-auto mb-2" size={22} />
              <p className="text-xs text-gray-500">Cook Time</p>
              <p className="font-bold text-gray-800">{formatTime(recipe.cookTime)}</p>
            </div>
            <div className="bg-cream-100 rounded-2xl p-4 text-center">
              <Users className="text-orange-500 mx-auto mb-2" size={22} />
              <p className="text-xs text-gray-500">Servings</p>
              <p className="font-bold text-gray-800">{recipe.servings}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-cream-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total Time</p>
              <p className="font-display text-2xl font-bold text-gray-800">{formatTime(totalTime)}</p>
            </div>
            <ChefHat className="text-orange-400" size={40} />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/cooking/${recipe.id}`)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <ChefHat size={20} /> Start Cooking Mode
            </button>
            <button
              onClick={handleFav}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium border transition-all ${
                fav ? 'bg-red-50 border-red-300 text-red-500' : 'bg-white border-cream-300 text-gray-600 hover:border-red-300'
              }`}
            >
              <Heart size={20} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save'}
            </button>
            <button onClick={handleShare} className="p-3 bg-white border border-cream-300 rounded-2xl text-gray-600 hover:border-orange-300 transition-colors">
              <Share2 size={20} />
            </button>
            <button onClick={handlePrint} className="p-3 bg-white border border-cream-300 rounded-2xl text-gray-600 hover:border-orange-300 transition-colors">
              <Printer size={20} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-cream-200">
        {['ingredients', 'instructions', 'reviews'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium capitalize transition-colors relative ${
              activeTab === tab ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'ingredients' && (
          <motion.div key="ingredients" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-gray-800">Ingredients</h2>
                  <div className="flex items-center gap-3 bg-cream-100 rounded-xl p-1">
                    <button onClick={() => setServings(s => Math.max(1, s - 1))} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-orange-50">
                      <Minus size={16} />
                    </button>
                    <span className="font-semibold text-gray-800 min-w-[60px] text-center">{servings} servings</span>
                    <button onClick={() => setServings(s => s + 1)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-orange-50">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {adjustedIngredients.map((ing, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                        checkedIngredients.has(idx) ? 'bg-forest-50' : 'bg-cream-50 hover:bg-cream-100'
                      }`}
                    >
                      {checkedIngredients.has(idx) ? (
                        <CheckCircle className="text-forest-500 shrink-0" size={22} />
                      ) : (
                        <Circle className="text-gray-300 shrink-0" size={22} />
                      )}
                      <span className={`flex-1 ${checkedIngredients.has(idx) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                        {ing.name}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                <ChefHat size={32} className="mb-3" />
                <h3 className="font-display text-xl font-bold mb-2">Ready to Cook?</h3>
                <p className="text-white/80 text-sm mb-4">Use our distraction-free cooking mode with step-by-step guidance and a built-in timer.</p>
                <button
                  onClick={() => navigate(`/cooking/${recipe.id}`)}
                  className="w-full py-3 bg-white text-orange-600 rounded-xl font-semibold hover:scale-105 transition-transform"
                >
                  Start Cooking
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-cream-200 p-6">
                <h3 className="font-display font-bold text-gray-800 mb-4">Recipe Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Cuisine</span><span className="font-medium text-gray-700">{recipe.cuisine}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Category</span><span className="font-medium text-gray-700">{recipe.category}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Difficulty</span><span className="font-medium text-gray-700">{recipe.difficulty}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Food Type</span><span className="font-medium capitalize text-gray-700">{recipe.foodType}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Ingredients</span><span className="font-medium text-gray-700">{recipe.ingredients.length}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Steps</span><span className="font-medium text-gray-700">{recipe.instructions.length}</span></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'instructions' && (
          <motion.div key="instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Progress */}
            <div className="bg-white rounded-2xl border border-cream-200 p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-gray-800">Cooking Progress</h3>
                <span className="text-sm font-semibold text-orange-600">{Math.round(progress)}% Complete</span>
              </div>
              <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{completedSteps.size} of {recipe.instructions.length} steps completed</p>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {recipe.instructions.map((inst, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-white rounded-2xl border p-6 flex gap-4 transition-all ${
                    completedSteps.has(idx) ? 'border-forest-300 bg-forest-50/50' : 'border-cream-200'
                  }`}
                >
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-display text-xl font-bold ${
                    completedSteps.has(idx) ? 'bg-forest-500 text-white' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {completedSteps.has(idx) ? <CheckCircle size={24} /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <p className={`text-gray-700 leading-relaxed flex-1 ${completedSteps.has(idx) ? 'line-through opacity-60' : ''}`}>
                        {inst.step}
                      </p>
                      <span className="text-3xl shrink-0">{inst.image}</span>
                    </div>
                    <button
                      onClick={() => toggleStep(idx)}
                      className={`mt-3 text-sm font-medium ${completedSteps.has(idx) ? 'text-gray-400' : 'text-orange-600 hover:text-orange-700'}`}
                    >
                      {completedSteps.has(idx) ? '← Mark as incomplete' : 'Mark as complete ✓'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={() => navigate('/recipes')}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-cream-300 rounded-2xl text-gray-600 font-medium hover:bg-cream-50"
              >
                <ArrowLeft size={18} /> Back to Recipes
              </button>
              <button
                onClick={() => navigate(`/cooking/${recipe.id}`)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                <ChefHat size={20} /> Cooking Mode
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-3xl">
            <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-6">
              <div className="flex items-center gap-6 mb-6">
                <div className="text-center">
                  <p className="font-display text-5xl font-bold text-gray-800">{recipe.rating}</p>
                  <RatingStars rating={recipe.rating} size={18} />
                  <p className="text-sm text-gray-500 mt-1">{recipe.reviews} reviews</p>
                </div>
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const pct = star === 5 ? 68 : star === 4 ? 22 : star === 3 ? 7 : star === 2 ? 2 : 1
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 w-4">{star}</span>
                        <Star size={14} className="text-orange-400" fill="currentColor" />
                        <div className="flex-1 h-2 bg-cream-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-gray-500 w-8 text-right text-xs">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-4">
              {[
                { name: 'Priya Sharma', rating: 5, text: 'Absolutely delicious! The step-by-step instructions made it so easy to follow. My family loved it!', date: '2 days ago', avatar: 'PS' },
                { name: 'Raj Kumar', rating: 4, text: 'Great recipe with clear instructions. Added a bit more spice to suit our taste. Will definitely make again!', date: '1 week ago', avatar: 'RK' },
                { name: 'Anita Desai', rating: 5, text: 'Perfect result on the first try. The cooking mode feature is incredibly helpful. Thank you SAVORIA!', date: '2 weeks ago', avatar: 'AD' },
              ].map((review, i) => (
                <div key={i} className="bg-white rounded-2xl border border-cream-200 p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-800">{review.name}</h4>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <RatingStars rating={review.rating} size={14} />
                      <p className="text-gray-600 mt-2 leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Recipes */}
      {related.length > 0 && (
        <div className="mt-16 pt-10 border-t border-cream-200">
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-8">Related Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}
