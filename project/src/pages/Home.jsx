import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Clock, Users, Star, Sparkles, ChefHat, UtensilsCrossed, BookOpen, Heart, Share2, Award, Leaf } from 'lucide-react'
import { motion } from 'framer-motion'
import { recipes, categories, cookingTips } from '../data/recipes'
import { categoryGradients, categoryEmojis } from '../data/recipeImages'
import RecipeCard from '../components/common/RecipeCard'
import RecipeImage from '../components/common/RecipeImage'
import RatingStars from '../components/common/RatingStars'
import { useToast } from '../context/ToastContext'
import { heroGradient } from '../data/recipeImages'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const { showToast } = useToast()

  const trendingRecipes = recipes.filter(r => r.trending).slice(0, 8)
  const popularRecipes = recipes.filter(r => r.popular).slice(0, 8)
  const featuredCategories = categories.slice(0, 6)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/recipes')
    }
  }

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (email) {
      showToast('Subscribed! Check your inbox for delicious updates.', 'success')
      setEmail('')
    }
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${heroGradient} min-h-[90vh] flex items-center`}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 50% 80%, rgba(0,0,0,0.2) 0%, transparent 50%)'
        }} />
        <div className="absolute top-10 right-10 text-9xl opacity-10 select-none">🍳</div>
        <div className="absolute bottom-10 left-10 text-8xl opacity-10 select-none">🥘</div>
        <div className="absolute top-1/2 left-1/4 text-7xl opacity-5 select-none">🍅</div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full text-white text-sm font-medium mb-6 border border-white/20"
            >
              <Sparkles size={16} />
              25+ Premium Recipes · Indian & International
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight text-balance"
            >
              Discover the Joy of Cooking
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Explore curated recipes from around the world, cook with step-by-step guidance, and share your culinary creations with a community of food lovers.
            </motion.p>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-2xl mx-auto mb-8"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search for recipes, cuisines, ingredients..."
                className="w-full pl-14 pr-32 py-4 bg-white rounded-2xl text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300/50 text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
              >
                Search
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/recipes"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-2xl font-semibold shadow-xl hover:scale-105 transition-all"
              >
                Explore Recipes <ArrowRight size={20} />
              </Link>
              <Link
                to="/categories"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/15 backdrop-blur-md text-white border border-white/30 rounded-2xl font-semibold hover:bg-white/25 transition-all"
              >
                Discover More
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Wave bottom */}
        <svg className="absolute bottom-0 left-0 right-0 w-full" viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none">
          <path d="M0 50 C 240 100 480 100 720 70 C 960 40 1200 40 1440 70 L 1440 100 L 0 100 Z" fill="#FFFBF5"/>
        </svg>
      </section>

      {/* POPULAR CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">Browse by Category</span>
          <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">Popular Categories</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Find exactly what you're craving with our curated recipe categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredCategories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/recipes?category=${encodeURIComponent(cat.name)}`}
                className={`group block bg-gradient-to-br ${categoryGradients[cat.name]} rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all aspect-square flex flex-col items-center justify-center`}
              >
                <span className="text-4xl mb-2 group-hover:scale-125 transition-transform">{categoryEmojis[cat.name]}</span>
                <h3 className="font-display font-bold text-white text-sm leading-tight">{cat.name}</h3>
                <p className="text-white/70 text-xs mt-1">{cat.count} recipes</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRENDING RECIPES */}
      <section className="py-20 bg-gradient-to-b from-cream-100 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">Hot Right Now</span>
              <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">Trending Recipes</h2>
            </div>
            <Link to="/recipes" className="flex items-center gap-2 text-orange-600 font-medium hover:gap-3 transition-all">
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* MOST POPULAR */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-forest-600 font-semibold text-sm tracking-wider uppercase">All Time Favorites</span>
            <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">Most Popular Recipes</h2>
          </div>
          <Link to="/recipes" className="flex items-center gap-2 text-forest-600 font-medium hover:gap-3 transition-all">
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRecipes.map((recipe, i) => (
            <RecipeCard key={recipe.id} recipe={recipe} index={i} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SAVORIA */}
      <section className="py-20 bg-gradient-to-br from-forest-700 via-forest-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-orange-400 font-semibold text-sm tracking-wider uppercase">Why Choose Us</span>
            <h2 className="font-display text-4xl font-bold mt-2">The SAVORIA Advantage</h2>
            <p className="text-white/60 mt-3 max-w-xl mx-auto">Everything you need to discover, cook, and share amazing food</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ChefHat, title: 'Curated Recipes', desc: 'Hand-picked recipes tested by home cooks and chefs for consistent results.', color: 'from-orange-400 to-red-500' },
              { icon: BookOpen, title: 'Step-by-Step', desc: 'Detailed cooking instructions with interactive cooking mode for every recipe.', color: 'from-forest-400 to-emerald-500' },
              { icon: UtensilsCrossed, title: 'Ingredient Finder', desc: 'Find recipes based on what you already have in your kitchen.', color: 'from-amber-400 to-orange-500' },
              { icon: Heart, title: 'Save & Share', desc: 'Build your personal cookbook and share your favorite recipes with the community.', color: 'from-rose-400 to-pink-500' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feat.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feat.icon size={26} className="text-white" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{feat.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COOKING TIPS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">Pro Tips</span>
          <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">Featured Cooking Tips</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Master the kitchen with expert tips from experienced cooks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cookingTips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200 hover:shadow-lg transition-all flex gap-4"
            >
              <div className="text-4xl shrink-0">{tip.icon}</div>
              <div>
                <h3 className="font-display text-lg font-bold text-gray-800 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">Join Our Community</span>
              <h2 className="font-display text-4xl font-bold text-gray-800 mt-2 mb-4">Cook Together, Share Together</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Be part of a vibrant community of food enthusiasts. Share your recipes, discover new favorites, and connect with fellow home cooks who share your passion for great food.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Share2, text: 'Share your own recipes with thousands of food lovers' },
                  { icon: Award, text: 'Get recognized for your cooking skills and creativity' },
                  { icon: Leaf, text: 'Discover healthy and sustainable cooking options' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <item.icon size={20} className="text-orange-600" />
                    </div>
                    <p className="text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/add-recipe"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all"
              >
                Share Your Recipe <ArrowRight size={20} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {recipes.slice(0, 4).map((recipe, i) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={i % 2 === 0 ? 'mt-8' : ''}
                >
                  <Link to={`/recipes/${recipe.id}`} className="block">
                    <RecipeImage recipe={recipe} size="md" className="w-full aspect-square shadow-lg hover:shadow-xl transition-shadow" />
                    <p className="font-display font-bold text-gray-800 mt-3 text-sm">{recipe.title}</p>
                    <RatingStars rating={recipe.rating} size={12} showNumber />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 rounded-3xl p-10 sm:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(0,0,0,0.2) 0%, transparent 50%)'
          }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <Sparkles className="text-white mx-auto mb-4" size={32} />
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">Get Delicious Recipes in Your Inbox</h2>
            <p className="text-white/90 mb-8 text-lg">Subscribe to our weekly newsletter for handpicked recipes, cooking tips, and exclusive content.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-4 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-semibold hover:bg-gray-800 transition-colors shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
