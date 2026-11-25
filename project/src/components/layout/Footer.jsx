import { Link } from 'react-router-dom'
import { ChefHat, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react'

export default function Footer() {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/recipes', label: 'Explore Recipes' },
    { to: '/categories', label: 'Categories' },
    { to: '/find-recipes', label: 'Find by Ingredients' },
    { to: '/add-recipe', label: 'Add Recipe' },
  ]

  const aboutLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/favorites', label: 'My Favorites' },
    { to: '/profile', label: 'My Profile' },
    { to: '/admin', label: 'Admin Dashboard' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="text-white" size={22} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl font-bold text-white">SAVORIA</span>
                <span className="text-[10px] text-orange-400 font-medium tracking-wider">DISCOVER · COOK · SHARE</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Discover delicious recipes from around the world, cook with confidence, and share your culinary creations with a passionate community.
            </p>
            <div className="flex gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={e => e.preventDefault()}
                  className="w-9 h-9 bg-gray-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={18} className="text-gray-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {aboutLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-400 hover:text-orange-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={18} className="text-orange-400 shrink-0 mt-0.5" />
                <span>123 Flavor Street, Foodie District, Culinary City 45678</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={18} className="text-orange-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={18} className="text-orange-400 shrink-0" />
                <span>hello@savoria.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2024 SAVORIA. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            Made with <Heart size={14} className="text-orange-500 fill-orange-500" /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  )
}
