import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, UtensilsCrossed } from 'lucide-react'
import { categories } from '../data/recipes'
import { categoryGradients, categoryEmojis } from '../data/recipeImages'

export default function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 text-sm font-medium mb-4">
          <UtensilsCrossed size={16} /> Recipe Categories
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-800 mb-3">Browse by Category</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Explore our collection of recipes organized by meal type, food preference, and cuisine style.</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={`/recipes?category=${encodeURIComponent(cat.name)}`}
              className="group block relative overflow-hidden rounded-3xl shadow-md hover:shadow-2xl transition-all aspect-[4/3]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${categoryGradients[cat.name]} group-hover:scale-110 transition-transform duration-500`} />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(0,0,0,0.3) 0%, transparent 50%)'
              }} />

              <div className="relative h-full p-6 flex flex-col justify-between text-white">
                <div className="flex items-start justify-between">
                  <span className="text-6xl group-hover:scale-125 transition-transform duration-300 inline-block">{categoryEmojis[cat.name]}</span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                    {cat.count} recipes
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-white/80 text-sm mb-3">{cat.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
                    Explore <ArrowRight size={18} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
