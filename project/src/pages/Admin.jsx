import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, ChefHat, Star, TrendingUp, Plus, Edit3, Trash2, Activity, Search, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { recipes } from '../data/recipes'
import { useToast } from '../context/ToastContext'
import { recipeGradients, recipeEmojis } from '../data/recipeImages'

export default function Admin() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')

  const stats = [
    { label: 'Total Recipes', value: recipes.length, icon: ChefHat, color: 'from-orange-400 to-red-500', change: '+12%' },
    { label: 'Total Users', value: '2,847', icon: Users, color: 'from-forest-400 to-emerald-500', change: '+8%' },
    { label: 'Total Reviews', value: '4,239', icon: Star, color: 'from-amber-400 to-yellow-500', change: '+24%' },
    { label: 'Avg Rating', value: '4.6', icon: TrendingUp, color: 'from-rose-400 to-pink-500', change: '+0.2' },
  ]

  const recentActivities = [
    { action: 'New recipe added', detail: 'Chicken Biryani', time: '5 min ago', type: 'add' },
    { action: 'User registered', detail: 'priya@gmail.com', time: '12 min ago', type: 'user' },
    { action: 'Review posted', detail: '5★ on Butter Chicken', time: '1 hour ago', type: 'review' },
    { action: 'Recipe updated', detail: 'Italian Pasta', time: '2 hours ago', type: 'edit' },
    { action: 'New recipe added', detail: 'Fruit Smoothie', time: '3 hours ago', type: 'add' },
  ]

  const filteredRecipes = recipes.filter(r => r.title.toLowerCase().includes(search.toLowerCase())).slice(0, 10)

  const handleDelete = (title) => showToast(`"${title}" would be deleted (demo)`, 'info')
  const handleEdit = (title) => showToast(`Edit mode for "${title}" (demo)`, 'info')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'recipes', label: 'Recipe Management' },
    { id: 'users', label: 'User Management' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage recipes, users, and platform analytics</p>
        </div>
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-forest-50 text-forest-700 rounded-xl text-sm font-medium border border-forest-200">
            Demo Mode
          </span>
          <Link to="/add-recipe" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-md hover:scale-105 transition-transform">
            <Plus size={18} /> Add Recipe
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-cream-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-md`}>
                <stat.icon className="text-white" size={22} />
              </div>
              <span className="text-xs font-semibold text-forest-600 bg-forest-50 px-2 py-1 rounded-lg">{stat.change}</span>
            </div>
            <p className="font-display text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-cream-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Analytics Chart (CSS-based) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-800 mb-6">Recipe Views (Last 7 Days)</h3>
            <div className="flex items-end justify-between gap-3 h-48">
              {[65, 45, 80, 55, 90, 70, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t-lg"
                    />
                  </div>
                  <span className="text-xs text-gray-400">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-orange-500" /> Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-cream-100 last:border-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    act.type === 'add' ? 'bg-forest-50 text-forest-600' :
                    act.type === 'user' ? 'bg-blue-50 text-blue-600' :
                    act.type === 'review' ? 'bg-amber-50 text-amber-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {act.type === 'add' ? <Plus size={16} /> : act.type === 'user' ? <Users size={16} /> : act.type === 'review' ? <Star size={16} /> : <Edit3 size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700">{act.action}</p>
                    <p className="text-xs text-gray-400">{act.detail}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cuisine Distribution */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
            <h3 className="font-display text-lg font-bold text-gray-800 mb-6">Recipes by Cuisine</h3>
            <div className="space-y-3">
              {[
                { name: 'Indian', count: 12, color: 'bg-orange-500' },
                { name: 'Italian', count: 3, color: 'bg-red-500' },
                { name: 'American', count: 4, color: 'bg-amber-500' },
                { name: 'Japanese', count: 1, color: 'bg-rose-500' },
                { name: 'Chinese', count: 1, color: 'bg-yellow-500' },
                { name: 'Others', count: 4, color: 'bg-forest-500' },
              ].map(c => (
                <div key={c.name} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-24">{c.name}</span>
                  <div className="flex-1 h-6 bg-cream-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(c.count / recipes.length) * 100}%` }}
                      className={`h-full ${c.color} rounded-full flex items-center justify-end pr-3`}
                    >
                      <span className="text-xs text-white font-bold">{c.count}</span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recipe Management Tab */}
      {activeTab === 'recipes' && (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-cream-200">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search recipes..."
                className="w-full pl-11 pr-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Recipe</th>
                  <th className="px-4 py-3">Cuisine</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredRecipes.map(r => (
                  <tr key={r.id} className="hover:bg-cream-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${recipeGradients[r.title] || 'from-orange-400 to-red-400'} rounded-lg flex items-center justify-center text-lg`}>
                          {recipeEmojis[r.title] || '🍽️'}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{r.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.cuisine}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.category}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">⭐ {r.rating}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.difficulty}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link to={`/recipes/${r.id}`} className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg"><Eye size={16} /></Link>
                        <button onClick={() => handleEdit(r.title)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={16} /></button>
                        <button onClick={() => handleDelete(r.title)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Recipes</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {[
                  { name: 'Priya Sharma', email: 'priya@gmail.com', recipes: 5, joined: 'Jan 2024' },
                  { name: 'Raj Kumar', email: 'raj@gmail.com', recipes: 3, joined: 'Feb 2024' },
                  { name: 'Anita Desai', email: 'anita@gmail.com', recipes: 7, joined: 'Jan 2024' },
                  { name: 'John Smith', email: 'john@gmail.com', recipes: 2, joined: 'Mar 2024' },
                  { name: 'Maria Garcia', email: 'maria@gmail.com', recipes: 4, joined: 'Feb 2024' },
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-cream-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="font-medium text-gray-800 text-sm">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.recipes}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Edit3 size={16} /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
