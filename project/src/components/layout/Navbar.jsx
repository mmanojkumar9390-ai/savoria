import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Search, Heart, User, LogOut, ChefHat, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFavorites } from '../context/FavoritesContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/recipes', label: 'Explore Recipes' },
    { to: '/categories', label: 'Categories' },
    { to: '/about', label: 'About Us' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-lg py-2' : 'bg-cream-50/80 backdrop-blur-sm py-3'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <ChefHat className="text-white" size={22} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl font-bold text-gray-800">SAVORIA</span>
              <span className="text-[10px] text-orange-500 font-medium tracking-wider">DISCOVER · COOK · SHARE</span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for recipes..."
              className="w-full pl-11 pr-4 py-2.5 bg-cream-100 border border-cream-300 rounded-full text-sm focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
            />
          </form>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-cream-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/favorites"
              className="relative p-2.5 rounded-xl hover:bg-cream-100 transition-colors"
              title="Favorites"
            >
              <Heart className={isActive('/favorites') ? 'text-orange-500 fill-orange-500' : 'text-gray-600'} size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cream-100 transition-colors">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
                </Link>
                <button onClick={logout} className="p-2.5 rounded-xl hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all"
              >
                <User size={16} />
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-cream-100 transition-colors"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                <form onSubmit={handleSearch} className="relative mb-3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search recipes..."
                    className="w-full pl-11 pr-4 py-3 bg-cream-100 border border-cream-300 rounded-full text-sm focus:outline-none focus:border-orange-400"
                  />
                </form>
                {navLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.to) ? 'text-orange-600 bg-orange-50' : 'text-gray-600 hover:bg-cream-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/find-recipes" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-cream-100">
                  Find by Ingredients
                </Link>
                <Link to="/add-recipe" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-cream-100">
                  Add Recipe
                </Link>
                <Link to="/contact" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-cream-100">
                  Contact
                </Link>
                {user ? (
                  <div className="pt-2 border-t border-cream-200 space-y-2">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-cream-100">
                      <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full" />
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50">
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-medium mt-2"
                  >
                    <User size={16} /> Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
