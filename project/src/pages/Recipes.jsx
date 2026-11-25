import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, Grid3x3, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { recipes, cuisines, difficulties, foodTypes } from '../data/recipes'
import RecipeCard from '../components/common/RecipeCard'
import EmptyState from '../components/common/EmptyState'
import { recipeService } from '../services/api'

const cookTimeOptions = [
  { value: 'all', label: 'Any time' },
  { value: '15', label: 'Under 15 min' },
  { value: '30', label: 'Under 30 min' },
  { value: '45', label: 'Under 45 min' },
  { value: '60', label: 'Under 60 min' },
]

const categoryOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages', 'Vegetarian', 'Non-Vegetarian', 'Healthy Food', 'Traditional Indian Food']

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [visibleCount, setVisibleCount] = useState(8)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || 'all',
    foodType: searchParams.get('foodType') || 'all',
    category: searchParams.get('category') || 'all',
    difficulty: 'all',
    maxCookTime: 'all',
    sort: 'popular',
  })

  useEffect(() => {
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    if (category || search) {
      setFilters(prev => ({
        ...prev,
        category: category || prev.category,
        search: search || prev.search,
      }))
    }
  }, [searchParams])

  useEffect(() => {
    setLoading(true)
    recipeService.getAllRecipes(filters).then(result => {
      setFilteredRecipes(result)
      setVisibleCount(8)
      setLoading(false)
    })
  }, [filters])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    if (key === 'category' || key === 'search') {
      const newParams = new URLSearchParams(searchParams)
      if (value && value !== 'all') newParams.set(key, value)
      else newParams.delete(key)
      setSearchParams(newParams, { replace: true })
    }
  }

  const clearAllFilters = () => {
    setFilters({
      search: '', cuisine: 'all', foodType: 'all', category: 'all',
      difficulty: 'all', maxCookTime: 'all', sort: 'popular',
    })
    setSearchParams({}, { replace: true })
  }

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    k !== 'sort' && v && v !== 'all' && v !== ''
  ).length

  const visibleRecipes = filteredRecipes.slice(0, visibleCount)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-gray-800">Explore Recipes</h1>
        <p className="text-gray-500 mt-2">Discover {recipes.length}+ delicious recipes from around the world</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={filters.search}
          onChange={e => updateFilter('search', e.target.value)}
          placeholder="Search by dish name..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-cream-300 rounded-2xl text-sm focus:outline-none focus:border-orange-400 shadow-sm"
        />
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-5 sticky top-24">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal size={18} /> Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-xs text-orange-500 hover:text-orange-600 font-medium">
                  Clear all
                </button>
              )}
            </div>

            <FilterSection title="Cuisine">
              <select value={filters.cuisine} onChange={e => updateFilter('cuisine', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                <option value="all">All cuisines</option>
                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterSection>

            <FilterSection title="Food Type">
              <div className="space-y-2">
                {['all', ...foodTypes].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" name="foodType" checked={filters.foodType === type} onChange={() => updateFilter('foodType', type)} className="accent-orange-500" />
                    <span className="capitalize text-gray-600">{type === 'all' ? 'All types' : type}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Category">
              <select value={filters.category} onChange={e => updateFilter('category', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                <option value="all">All categories</option>
                {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FilterSection>

            <FilterSection title="Cooking Time">
              <select value={filters.maxCookTime} onChange={e => updateFilter('maxCookTime', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                {cookTimeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </FilterSection>

            <FilterSection title="Difficulty">
              <div className="space-y-2">
                {['all', ...difficulties].map(d => (
                  <label key={d} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="radio" name="difficulty" checked={filters.difficulty === d} onChange={() => updateFilter('difficulty', d)} className="accent-orange-500" />
                    <span className="text-gray-600">{d === 'all' ? 'All levels' : d}</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm font-medium shadow-sm"
            >
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5">{activeFilterCount}</span>
              )}
            </button>

            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-500 hidden sm:block">
                {loading ? 'Loading...' : `${filteredRecipes.length} recipes found`}
              </span>
              <select
                value={filters.sort}
                onChange={e => updateFilter('sort', e.target.value)}
                className="px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-orange-400 shadow-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="quick">Quickest</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6 overflow-hidden"
              >
                <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-gray-800">Filters</h3>
                    <button onClick={clearAllFilters} className="text-xs text-orange-500 font-medium">Clear all</button>
                  </div>
                  <FilterSection title="Cuisine">
                    <select value={filters.cuisine} onChange={e => updateFilter('cuisine', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                      <option value="all">All cuisines</option>
                      {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FilterSection>
                  <FilterSection title="Food Type">
                    <select value={filters.foodType} onChange={e => updateFilter('foodType', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                      <option value="all">All types</option>
                      {foodTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </FilterSection>
                  <FilterSection title="Category">
                    <select value={filters.category} onChange={e => updateFilter('category', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                      <option value="all">All categories</option>
                      {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </FilterSection>
                  <FilterSection title="Cooking Time">
                    <select value={filters.maxCookTime} onChange={e => updateFilter('maxCookTime', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                      {cookTimeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </FilterSection>
                  <FilterSection title="Difficulty">
                    <select value={filters.difficulty} onChange={e => updateFilter('difficulty', e.target.value)} className="w-full px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm">
                      <option value="all">All levels</option>
                      {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </FilterSection>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recipe Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-cream-200 animate-pulse">
                  <div className="h-48 bg-cream-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-cream-200 rounded w-1/3" />
                    <div className="h-6 bg-cream-200 rounded w-3/4" />
                    <div className="h-4 bg-cream-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : visibleRecipes.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No Recipes Found"
              message="Try adjusting your filters or search for something different."
              actionLabel="Clear All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleRecipes.map((recipe, i) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={i} />
                ))}
              </div>

              {visibleCount < filteredRecipes.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount(prev => prev + 8)}
                    className="px-8 py-3.5 bg-white border-2 border-orange-400 text-orange-600 rounded-2xl font-semibold hover:bg-orange-50 transition-colors shadow-sm"
                  >
                    Load More Recipes ({filteredRecipes.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function FilterSection({ title, children }) {
  return (
    <div className="mb-5 pb-5 border-b border-cream-100 last:border-0 last:pb-0 last:mb-0">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{title}</h4>
      {children}
    </div>
  )
}
