import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { validateEmail } from '../utils/helpers'

export default function Contact() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  const faqs = [
    { q: 'How do I add my own recipe?', a: 'Navigate to the "Add Recipe" page from the menu, fill in the recipe details including ingredients and step-by-step instructions, preview it, and submit. Your recipe will be saved and accessible from your profile.' },
    { q: 'Is SAVORIA free to use?', a: 'Yes! SAVORIA is completely free for all users. You can browse, search, save, and share recipes without any cost. Create a free account to unlock favorites and personal recipe collections.' },
    { q: 'How does the ingredient finder work?', a: 'Go to "Find Recipes," enter the ingredients you have in your kitchen, and click "Find Recipes." We\'ll show you recipes you can make, along with what you have and what you\'re missing.' },
    { q: 'Can I save recipes for offline access?', a: 'Currently, saved recipes are stored in your browser. They\'ll be available when you revisit the site on the same device. Cloud sync is coming soon!' },
    { q: 'How do I use the cooking mode?', a: 'Open any recipe and click "Start Cooking Mode." You\'ll get a distraction-free view with one step at a time, a built-in timer, and a progress tracker to guide you through the entire cooking process.' },
  ]

  const validate = () => {
    const errs = {}
    if (!form.name) errs.name = 'Name is required'
    if (!form.email) errs.email = 'Email is required'
    else if (!validateEmail(form.email)) errs.email = 'Invalid email'
    if (!form.subject) errs.subject = 'Subject is required'
    if (!form.message) errs.message = 'Message is required'
    else if (form.message.length < 10) errs.message = 'Message too short (min 10 characters)'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      showToast('Message sent! We\'ll get back to you soon.', 'success')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 800)
  }

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: '123 Flavor Street, Foodie District, Culinary City 45678' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
    { icon: Mail, label: 'Email', value: 'hello@savoria.com' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 text-sm font-medium mb-4">
          <MessageSquare size={16} /> Get in Touch
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-gray-800 mb-3">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Have a question, suggestion, or just want to say hello? We'd love to hear from you.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl border border-cream-200 shadow-sm p-8">
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className={`w-full pl-11 pr-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.name ? 'border-red-300' : 'border-cream-200'}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className={`w-full pl-11 pr-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.email ? 'border-red-300' : 'border-cream-200'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Subject *</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  placeholder="How can we help?"
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.subject ? 'border-red-300' : 'border-cream-200'}`}
                />
                {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Message *</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us more..."
                  rows={5}
                  className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none ${errors.message ? 'border-red-300' : 'border-cream-200'}`}
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-60"
              >
                <Send size={18} /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          {contactInfo.map((info, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-3 shadow-md">
                <info.icon className="text-white" size={22} />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{info.label}</h3>
              <p className="text-sm text-gray-500">{info.value}</p>
            </div>
          ))}

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-display text-lg font-bold mb-2">Customer Support</h3>
            <p className="text-sm text-white/80 mb-3">Available Monday to Friday, 9 AM - 6 PM IST</p>
            <p className="text-sm text-white/80">Response time: within 24 hours</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <p className="text-gray-500 mt-2">Find quick answers to common questions</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-medium text-gray-800">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`text-orange-500 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
