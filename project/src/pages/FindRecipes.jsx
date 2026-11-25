import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, X, Search, ChefHat, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { recipeService } from '../services/api'
import RecipeCard from '../components/common/RecipeCard'
import EmptyState from '../components/common/EmptyState'
import { useToast } from '../context/ToastContext'

const suggestions = ['Rice', 'Tomato', 'Onion', 'Chicken', 'Flour', 'Eggs', 'Potato', 'Garlic', 'Ginger', 'Spinach', 'Cheese', 'Pasta']

export default function FindRecipes() {
  const [ingredients, setIngredients] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [foodTypeFilter, setFoodTypeFilter] = useState('all')
  const { showToast } = useToast()

  const addIngredient = (name) => {
    const trimmed = name.trim()
    if (trimmed && !ingredients.find(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients(prev => [...prev, trimmed])
      setInputValue('')
    }
  }

  const removeIngredient = (idx) => {
    setIngredients(prev => prev.filter((_, i) => i !== idx))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) addIngredient(inputValue)
    }
  }

  const handleFind = async () => {
    if (ingredients.length === 0) {
      showToast('Please add at least one ingredient', 'error')
      return
    }
    setSearching(true)
    setHasSearched(true)
    const found = await recipeService.findRecipesByIngredients(ingredients)
    setResults(found)
    setSearching(false)
    if (found.length === 0) showToast('No recipes found with those ingredients', 'info')
    else showToast(`Found ${found.length} matching recipes!`, 'success')
  }

  const filteredResults = foodTypeFilter === 'all'
    ? results
    : results.filter(r => r.foodType === foodTypeFilter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 text-sm font-medium mb-4">
          <Sparkles size={16} /> Smart Ingredient Finder
        </div>
        <h1 className="font-display text-4xl font-bold text-gray-800 mb-3">Find Recipes by Ingredients</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Enter what you have in your kitchen and we'll find recipes you can cook right now.</p>
      </div>

      {/* Ingredient Input */}
      <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-6 mb-8 max-w-3xl mx-auto">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type an ingredient and press Enter..."
            className="w-full pl-12 pr-4 py-3.5 bg-cream-50 border border-cream-200 rounded-2xl text-sm focus:outline-none focus:border-orange-400"
          />
        </div>

        {/* Ingredient Tags */}
        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <AnimatePresence>
              {ingredients.map((ing, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-cream-100 border border-orange-200 rounded-full text-sm font-medium text-orange-700"
                >
                  {ing}
                  <button onClick={() => removeIngredient(idx)} className="text-orange-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suggestions */}
        {ingredients.length === 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">Try these common ingredients:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => addIngredient(s)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cream-50 hover:bg-orange-50 border border-cream-200 hover:border-orange-200 rounded-full text-sm text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <Plus size={14} /> {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleFind}
          disabled={ingredients.length === 0 || searching}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <ChefHat size={20} />
          {searching ? 'Finding Recipes...' : `Find Recipes (${ingredients.length} ingredients)`}
        </button>
      </div>

      {/* Results */}
      {hasSearched && !searching && (
        <div>
          {filteredResults.length > 0 && (
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold text-gray-800">
                {filteredResults.length} Recipes Found
              </h2>
              <div className="flex gap-2">
                {['all', 'vegetarian', 'non-vegetarian'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFoodTypeFilter(type)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                      foodTypeFilter === type
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-cream-300 text-gray-600 hover:bg-cream-50'
                    }`}
                  >
                    {type === 'all' ? 'All' : type.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredResults.length > 0 ? (
            <div className="space-y-4 mb-8">
              {/* Match details */}
              {filteredResults.slice(0, 4).map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/recipes/${recipe.id}`}
                    className="group flex flex-col sm:flex-row gap-4 bg-white rounded-2xl border border-cream-200 shadow-sm hover:shadow-lg p-4 transition-all"
                  >
                    <div className="w-full sm:w-32 h-32 shrink-0">
                      <RecipeImageSmall recipe={recipe} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="font-display text-lg font-bold text-gray-800 group-hover:text-orange-600">{recipe.title}</h3>
                        <div className="shrink-0">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-cream-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${recipe.matchPercentage >= 75 ? 'bg-forest-500' : recipe.matchPercentage >= 50 ? 'bg-orange-500' : 'bg-amber-400'}`}
                                style={{ width: `${recipe.matchPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-700">{recipe.matchPercentage}%</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 text-right">match</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>

                      {/* Available & Missing */}
                      <div className="flex flex-wrap gap-2">
                        {recipe.matchedIngredients.map((ing, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-forest-50 text-forest-700 rounded-full text-xs font-medium">
                            <Check size={12} /> {ing}
                          </span>
                        ))}
                        {recipe.missingIngredients.slice(0, 3).map((ing, idx) => (
                          <span key={idx} className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                            <AlertCircle size={12} /> {ing.name}
                          </span>
                        ))}
                        {recipe.missingIngredients.length > 3 && (
                          <span className="px-2.5 py-1 bg-cream-100 text-gray-500 rounded-full text-xs">
                            +{recipe.missingIngredients.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="🤔"
              title="No Matching Recipes"
              message="We couldn't find recipes with those ingredients. Try adding more or different ingredients."
              actionLabel="Browse All Recipes"
              onAction={() => window.location.href = '/recipes'}
            />
          )}
        </div>
      )}
    </div>
  )
}

function RecipeImageSmall({ recipe }) {
  return (
    <div className="w-full h-full overflow-hidden rounded-xl">
      <RecipeCard recipe={recipe} index={0} />
    </div>
  )
}
