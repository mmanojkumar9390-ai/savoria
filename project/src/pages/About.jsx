import { Link } from 'react-router-dom'
import { Target, Eye, Sparkles, Users, ChefHat, Heart, ArrowRight, Mail, Phone, MapPin, UtensilsCrossed, BookOpen, Award } from 'lucide-react'
import { motion } from 'framer-motion'

export default function About() {
  const features = [
    { icon: ChefHat, title: 'Curated Recipes', desc: 'Every recipe is tested and perfected for home cooks of all levels.' },
    { icon: BookOpen, title: 'Step-by-Step Guides', desc: 'Interactive cooking mode with timers and progress tracking.' },
    { icon: UtensilsCrossed, title: 'Smart Ingredient Finder', desc: 'Find recipes based on what you already have in your kitchen.' },
    { icon: Heart, title: 'Save & Share', desc: 'Build your personal cookbook and share recipes with the community.' },
    { icon: Users, title: 'Community Driven', desc: 'Connect with fellow food lovers and discover new favorites daily.' },
    { icon: Award, title: 'Quality First', desc: 'Premium recipes with detailed nutritional and timing information.' },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-forest-700 via-forest-800 to-gray-900 text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-forest-400/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <ChefHat className="text-white" size={40} />
            </div>
            <h1 className="font-display text-5xl font-bold mb-4">About SAVORIA</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              We're on a mission to bring the joy of cooking to every kitchen, one recipe at a time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-orange-50 to-cream-100 rounded-3xl p-8 border border-orange-100">
            <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Target className="text-white" size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To empower home cooks with the tools, recipes, and confidence they need to create delicious meals. We believe everyone deserves access to quality recipes that are easy to follow, culturally diverse, and genuinely fun to cook.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-gradient-to-br from-forest-50 to-cream-100 rounded-3xl p-8 border border-forest-100">
            <div className="w-14 h-14 bg-forest-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Eye className="text-white" size={28} />
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the world's most loved cooking companion — a platform where food enthusiasts discover, create, and share recipes that bring families together, celebrate cultural diversity, and make cooking an enjoyable experience for all.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Created */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Sparkles className="text-orange-500 mx-auto mb-4" size={32} />
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">Why We Created SAVORIA</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Cooking should be joyful, not stressful. We noticed that many people want to cook but feel overwhelmed by complicated recipes, unclear instructions, and the constant question of "what can I make with what I have?" SAVORIA was born to solve these problems — with a clean, intuitive platform that guides you from ingredient to plate with confidence.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-orange-500 font-semibold text-sm tracking-wider uppercase">Features & Benefits</span>
          <h2 className="font-display text-4xl font-bold text-gray-800 mt-2">What Makes Us Special</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                <feat.icon className="text-white" size={24} />
              </div>
              <h3 className="font-display text-lg font-bold text-gray-800 mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-cream-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="text-orange-500 mx-auto mb-4" size={40} />
          <h2 className="font-display text-3xl font-bold text-gray-800 mb-4">Community Cooking Concept</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            SAVORIA isn't just a recipe platform — it's a community. We believe the best recipes are shared, modified, and passed down. Every user can contribute their recipes, share cooking tips, and help others discover new flavors. Together, we're building the most diverse and accessible recipe collection.
          </p>
          <Link to="/add-recipe" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform">
            Share Your Recipe <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl font-bold text-gray-800">Get in Touch</h2>
          <p className="text-gray-500 mt-3">Have questions? We'd love to hear from you.</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: MapPin, label: 'Address', value: '123 Flavor Street, Culinary City' },
            { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
            { icon: Mail, label: 'Email', value: 'hello@savoria.com' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-200 p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <item.icon className="text-orange-500" size={24} />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-orange-300 text-orange-600 rounded-xl font-medium hover:bg-orange-50">
            Visit Contact Page <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
