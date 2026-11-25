import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Edit3, Save, X, ChefHat, Heart, Clock, LogOut, Camera, UtensilsCrossed } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { useToast } from '../context/ToastContext'
import { recipeService } from '../services/api'
import EmptyState from '../components/common/EmptyState'
import RecipeImage from '../components/common/RecipeImage'
import RatingStars from '../components/common/RatingStars'

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const { favorites } = useFavorites()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [avatar, setAvatar] = useState(user?.avatar || '')
  const [activeTab, setActiveTab] = useState('favorites')
  const [myRecipes, setMyRecipes] = useState([])
  const [cookingHistory, setCookingHistory] = useState([])

  useEffect(() => {
    recipeService.getUserRecipes().then(setMyRecipes)
    const history = JSON.parse(localStorage.getItem('savoria_cooking_history') || '[]')
    setCookingHistory(history)
  }, [])

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <EmptyState
          icon="🔒"
          title="Please Login"
          message="You need to be logged in to view your profile."
          actionLabel="Go to Login"
          onAction={() => navigate('/login')}
        />
      </div>
    )
  }

  const handleSave = () => {
    const newAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=F97316&color=fff&size=128`
    updateProfile({ name, avatar: newAvatar })
    setAvatar(newAvatar)
    setEditing(false)
    showToast('Profile updated successfully!', 'success')
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
    navigate('/')
  }

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
    { id: 'my-recipes', label: 'My Recipes', icon: ChefHat, count: myRecipes.length },
    { id: 'history', label: 'Cooking History', icon: Clock, count: cookingHistory.length },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 rounded-3xl p-8 text-white mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }} />
        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img src={editing ? avatar : user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white/30 shadow-lg" />
            {editing && (
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                <Camera size={24} />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 text-white text-xl font-display font-bold focus:outline-none focus:ring-2 focus:ring-white/40"
              />
            ) : (
              <h1 className="font-display text-3xl font-bold">{user.name}</h1>
            )}
            <p className="text-white/80 mt-1 flex items-center gap-2 justify-center sm:justify-start">
              <Mail size={16} /> {user.email}
            </p>
          </div>
          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-white text-orange-600 rounded-xl font-medium hover:scale-105 transition-transform">
                  <Save size={18} /> Save
                </button>
                <button onClick={() => { setEditing(false); setName(user.name) }} className="p-2.5 bg-white/20 rounded-xl">
                  <X size={18} />
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md rounded-xl font-medium hover:bg-white/30">
                <Edit3 size={18} /> Edit Profile
              </button>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md rounded-xl font-medium hover:bg-white/30">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-red-500 bg-red-50' },
          { label: 'My Recipes', value: myRecipes.length, icon: ChefHat, color: 'text-orange-500 bg-orange-50' },
          { label: 'Cooked', value: cookingHistory.length, icon: UtensilsCrossed, color: 'text-forest-500 bg-forest-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl border border-cream-200 p-5 text-center shadow-sm">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon size={22} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-cream-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 font-medium transition-colors relative ${
              activeTab === tab.id ? 'text-orange-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={18} /> {tab.label}
            <span className="text-xs bg-cream-100 px-2 py-0.5 rounded-full">{tab.count}</span>
            {activeTab === tab.id && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' && (
        <div>
          {favorites.length === 0 ? (
            <EmptyState icon="💔" title="No Favorites" message="Your saved recipes will appear here." actionLabel="Browse Recipes" onAction={() => navigate('/recipes')} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map(r => (
                <Link key={r.id} to={`/recipes/${r.id}`} className="bg-white rounded-2xl border border-cream-200 overflow-hidden hover:shadow-lg transition-all flex">
                  <RecipeImage recipe={r} size="sm" className="w-24 h-24 shrink-0 !rounded-none" />
                  <div className="p-3 flex-1 min-w-0">
                    <h4 className="font-display font-bold text-gray-800 text-sm truncate">{r.title}</h4>
                    <RatingStars rating={r.rating} size={12} showNumber />
                    <p className="text-xs text-gray-400 mt-1">{r.cuisine}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'my-recipes' && (
        <div>
          {myRecipes.length === 0 ? (
            <EmptyState icon="🍳" title="No Recipes Submitted" message="Share your culinary creations with the community." actionLabel="Add a Recipe" onAction={() => navigate('/add-recipe')} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRecipes.map(r => (
                <Link key={r.id} to={`/recipes/${r.id}`} className="bg-white rounded-2xl border border-cream-200 p-4 hover:shadow-lg transition-all">
                  <h4 className="font-display font-bold text-gray-800">{r.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{r.description}</p>
                  <div className="flex gap-2 mt-2 text-xs text-gray-400">
                    <span>{r.cuisine}</span>·<span>{r.difficulty}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {cookingHistory.length === 0 ? (
            <EmptyState icon="⏱️" title="No Cooking History" message="Start cooking to track your history here." actionLabel="Browse Recipes" onAction={() => navigate('/recipes')} />
          ) : (
            <div className="space-y-3">
              {cookingHistory.map((h, i) => (
                <div key={i} className="bg-white rounded-2xl border border-cream-200 p-4 flex items-center gap-4">
                  <Clock className="text-orange-400" size={24} />
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{h.title}</h4>
                    <p className="text-xs text-gray-400">Cooked on {new Date(h.date).toLocaleDateString()}</p>
                  </div>
                  <Link to={`/recipes/${h.id}`} className="text-orange-600 text-sm font-medium">View</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
