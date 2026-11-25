import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CheckCircle, Circle, Timer, Pause, Play,
  X, ChefHat, Trophy, RotateCcw, UtensilsCrossed
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { recipeService } from '../services/api'
import RecipeImage from '../components/common/RecipeImage'
import LoadingSpinner from '../components/common/LoadingSpinner'
import EmptyState from '../components/common/EmptyState'
import { useToast } from '../context/ToastContext'
import { adjustIngredients, formatTime } from '../utils/helpers'

export default function CookingMode() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [checkedIngredients, setCheckedIngredients] = useState(new Set())
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerInput, setTimerInput] = useState('')
  const [showFinish, setShowFinish] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    recipeService.getRecipeById(id).then(r => {
      setRecipe(r)
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            setTimerRunning(false)
            showToast('Timer finished! ⏰', 'success')
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [timerRunning])

  const adjustedIngredients = useMemo(() => {
    if (!recipe) return []
    return adjustIngredients(recipe.ingredients, recipe.servings, recipe.servings)
  }, [recipe])

  if (loading) return <LoadingSpinner fullPage />
  if (!recipe) return <EmptyState icon="🍳" title="Recipe Not Found" message="This recipe doesn't exist." actionLabel="Browse Recipes" onAction={() => navigate('/recipes')} />

  const totalSteps = recipe.instructions.length
  const progress = (completedSteps.size / totalSteps) * 100
  const stepProgress = ((currentStep + 1) / totalSteps) * 100
  const isLastStep = currentStep === totalSteps - 1
  const isFirstStep = currentStep === 0

  const formatTimer = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const setTimer = () => {
    const mins = parseInt(timerInput)
    if (mins > 0) {
      setTimerSeconds(mins * 60)
      setTimerRunning(true)
      setTimerInput('')
      showToast(`Timer set for ${mins} minutes`, 'info')
    }
  }

  const toggleStep = () => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      next.has(currentStep) ? next.delete(currentStep) : next.add(currentStep)
      return next
    })
  }

  const nextStep = () => {
    if (!isLastStep) setCurrentStep(s => s + 1)
    else setShowFinish(true)
  }

  const prevStep = () => {
    if (!isFirstStep) setCurrentStep(s => s - 1)
  }

  const restart = () => {
    setCurrentStep(0)
    setCompletedSteps(new Set())
    setShowFinish(false)
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-cream-100 to-cream-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-cream-300 rounded-xl text-gray-600 font-medium hover:bg-cream-50 shadow-sm"
          >
            <ArrowLeft size={18} /> Exit
          </button>
          <div className="flex items-center gap-2">
            <ChefHat className="text-orange-500" size={24} />
            <span className="font-display font-bold text-gray-800">Cooking Mode</span>
          </div>
        </div>

        {/* Recipe Title */}
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-800">{recipe.title}</h1>
          <p className="text-gray-500 mt-2">{recipe.cuisine} · {recipe.category}</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-2xl border border-cream-200 p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">Step {currentStep + 1} of {totalSteps}</span>
            <span className="text-sm font-semibold text-orange-600">{completedSteps.size} completed</span>
          </div>
          <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
              animate={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Timer size={28} />
              <div>
                <p className="text-white/70 text-xs uppercase tracking-wider">Cooking Timer</p>
                <p className="font-display text-4xl font-bold tabular-nums">{formatTimer(timerSeconds)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={timerInput}
                onChange={e => setTimerInput(e.target.value)}
                placeholder="min"
                className="w-20 px-3 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button onClick={setTimer} className="px-4 py-2 bg-white text-orange-600 rounded-xl font-medium text-sm hover:scale-105 transition-transform">
                Set
              </button>
              <button
                onClick={() => setTimerRunning(r => !r)}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                {timerRunning ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                onClick={() => { setTimerSeconds(0); setTimerRunning(false) }}
                className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="bg-white rounded-3xl border border-cream-200 p-8 mb-6 shadow-sm"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display text-3xl font-bold ${
                completedSteps.has(currentStep) ? 'bg-forest-500 text-white' : 'bg-orange-100 text-orange-600'
              }`}>
                {completedSteps.has(currentStep) ? <CheckCircle size={32} /> : currentStep + 1}
              </div>
              <div>
                <p className="text-sm text-gray-500">Step {currentStep + 1}</p>
                <p className="text-xs text-gray-400">{formatTime(recipe.prepTime + recipe.cookTime)} total</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
              <span className="text-6xl shrink-0">{recipe.instructions[currentStep].image}</span>
              <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-medium">
                {recipe.instructions[currentStep].step}
              </p>
            </div>

            <button
              onClick={toggleStep}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                completedSteps.has(currentStep)
                  ? 'bg-forest-50 text-forest-700 border border-forest-200'
                  : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100'
              }`}
            >
              {completedSteps.has(currentStep) ? (
                <><CheckCircle size={18} /> Step Completed</>
              ) : (
                <><Circle size={18} /> Mark as Complete</>
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={prevStep}
            disabled={isFirstStep}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-cream-300 rounded-2xl font-medium text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-50 shadow-sm"
          >
            <ArrowLeft size={20} /> Previous
          </button>
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            {isLastStep ? 'Finish Cooking' : 'Next'} <ArrowRight size={20} />
          </button>
        </div>

        {/* Ingredients Checklist */}
        <div className="bg-white rounded-2xl border border-cream-200 p-6 shadow-sm">
          <h3 className="font-display text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UtensilsCrossed size={20} className="text-orange-500" /> Ingredients Checklist
          </h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {adjustedIngredients.map((ing, idx) => (
              <div
                key={idx}
                onClick={() => setCheckedIngredients(prev => {
                  const next = new Set(prev)
                  next.has(idx) ? next.delete(idx) : next.add(idx)
                  return next
                })}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  checkedIngredients.has(idx) ? 'bg-forest-50' : 'bg-cream-50 hover:bg-cream-100'
                }`}
              >
                {checkedIngredients.has(idx) ? (
                  <CheckCircle className="text-forest-500 shrink-0" size={20} />
                ) : (
                  <Circle className="text-gray-300 shrink-0" size={20} />
                )}
                <span className={`text-sm flex-1 ${checkedIngredients.has(idx) ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {ing.name}
                </span>
                <span className="text-xs font-medium text-orange-600">{ing.quantity} {ing.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {recipe.instructions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-8 bg-orange-500'
                  : completedSteps.has(idx)
                  ? 'w-2.5 bg-forest-400'
                  : 'w-2.5 bg-cream-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Finish Modal */}
      <AnimatePresence>
        {showFinish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowFinish(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Trophy className="text-white" size={40} />
              </div>
              <h2 className="font-display text-3xl font-bold text-gray-800 mb-2">Congratulations!</h2>
              <p className="text-gray-500 mb-6">You've successfully cooked {recipe.title}. Enjoy your meal!</p>
              <div className="flex gap-3">
                <button onClick={restart} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-cream-100 text-gray-700 rounded-xl font-medium hover:bg-cream-200">
                  <RotateCcw size={18} /> Cook Again
                </button>
                <Link to={`/recipes/${recipe.id}`} className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold">
                  View Recipe
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
