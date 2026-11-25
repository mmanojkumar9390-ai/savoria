import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowRight, ChefHat, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { validateEmail } from '../utils/helpers'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const { showToast } = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) { setError('Email is required'); return }
    if (!validateEmail(email)) { setError('Invalid email format'); return }
    setError('')
    setSent(true)
    showToast('Password reset link sent to your email', 'success')
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-cream-200 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ChefHat className="text-white" size={32} />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-800">Reset Password</h1>
            <p className="text-gray-500 mt-2">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <CheckCircle className="text-forest-500 mx-auto mb-4" size={56} />
              <h2 className="font-display text-xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
              </p>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${error ? 'border-red-300' : 'border-cream-200'}`}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.02] transition-transform"
              >
                Send Reset Link <ArrowRight size={18} />
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-orange-600 font-semibold hover:text-orange-700">
              ← Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
