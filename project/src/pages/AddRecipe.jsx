import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Eye, ChefHat, Save, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { recipeService } from '../services/api'
import { cuisines, difficulties } from '../data/recipes'
import { recipeGradients, recipeEmojis } from '../data/recipeImages'

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts', 'Beverages']

export default function AddRecipe() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '', description: '', imageUrl: '', category: '', cuisine: '',
    foodType: 'vegetarian', prepTime: '', cookTime: '', difficulty: 'Easy', servings: 4,
  })
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: '' }])
  const [instructions, setInstructions] = useState([{ step: '', image: '🍳' }])
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(false)

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const addIngredient = () => setIngredients(prev => [...prev, { name: '', quantity: '', unit: '' }])
  const removeIngredient = (idx) => setIngredients(prev => prev.filter((_, i) => i !== idx))
  const updateIngredient = (idx, key, value) => setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, [key]: value } : ing))

  const addInstruction = () => setInstructions(prev => [...prev, { step: '', image: '🍳' }])
  const removeInstruction = (idx) => setInstructions(prev => prev.filter((_, i) => i !== idx))
  const updateInstruction = (idx, key, value) => setInstructions(prev => prev.map((inst, i) => i === idx ? { ...inst, [key]: value } : inst))

  const validate = () => {
    const errs = {}
    if (!form.title) errs.title = 'Title is required'
    if (!form.description) errs.description = 'Description is required'
    if (!form.category) errs.category = 'Category is required'
    if (!form.cuisine) errs.cuisine = 'Cuisine is required'
    if (!form.prepTime || form.prepTime < 0) errs.prepTime = 'Valid prep time required'
    if (!form.cookTime || form.cookTime < 0) errs.cookTime = 'Valid cook time required'
    if (ingredients.filter(i => i.name).length < 2) errs.ingredients = 'At least 2 ingredients required'
    if (instructions.filter(i => i.step).length < 2) errs.instructions = 'At least 2 steps required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      showToast('Please fix the errors before submitting', 'error')
      return
    }
    setLoading(true)
    const recipeData = {
      ...form,
      prepTime: parseInt(form.prepTime),
      cookTime: parseInt(form.cookTime),
      servings: parseInt(form.servings),
      ingredients: ingredients.filter(i => i.name),
      instructions: instructions.filter(i => i.step),
    }
    const result = await recipeService.submitRecipe(recipeData)
    setLoading(false)
    if (result.success) {
      showToast('Recipe submitted successfully!', 'success')
      navigate(`/recipes/${result.recipe.id}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-gray-800 flex items-center gap-3">
          <ChefHat className="text-orange-500" /> Add Your Recipe
        </h1>
        <p className="text-gray-500 mt-2">Share your culinary creation with the SAVORIA community</p>
      </div>

      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-700">
          You can submit recipes, but we recommend <a href="/login" className="font-semibold underline">logging in</a> to save them to your profile.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6 space-y-4">
          <h2 className="font-display text-xl font-bold text-gray-800">Basic Information</h2>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Recipe Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => updateForm('title', e.target.value)}
              placeholder="e.g., Grandmother's Apple Pie"
              className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.title ? 'border-red-300' : 'border-cream-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
            <textarea
              value={form.description}
              onChange={e => updateForm('description', e.target.value)}
              placeholder="Brief description of your dish..."
              rows={3}
              className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none ${errors.description ? 'border-red-300' : 'border-cream-200'}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Image URL (optional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => updateForm('imageUrl', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-11 pr-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Leave empty to use an auto-generated food image</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Category *</label>
              <select value={form.category} onChange={e => updateForm('category', e.target.value)} className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.category ? 'border-red-300' : 'border-cream-200'}`}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cuisine *</label>
              <select value={form.cuisine} onChange={e => updateForm('cuisine', e.target.value)} className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.cuisine ? 'border-red-300' : 'border-cream-200'}`}>
                <option value="">Select cuisine</option>
                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.cuisine && <p className="text-xs text-red-500 mt-1">{errors.cuisine}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Food Type</label>
              <select value={form.foodType} onChange={e => updateForm('foodType', e.target.value)} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Prep Time (min) *</label>
              <input type="number" min="0" value={form.prepTime} onChange={e => updateForm('prepTime', e.target.value)} placeholder="15" className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.prepTime ? 'border-red-300' : 'border-cream-200'}`} />
              {errors.prepTime && <p className="text-xs text-red-500 mt-1">{errors.prepTime}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cook Time (min) *</label>
              <input type="number" min="0" value={form.cookTime} onChange={e => updateForm('cookTime', e.target.value)} placeholder="30" className={`w-full px-4 py-3 bg-cream-50 border rounded-xl text-sm focus:outline-none focus:border-orange-400 ${errors.cookTime ? 'border-red-300' : 'border-cream-200'}`} />
              {errors.cookTime && <p className="text-xs text-red-500 mt-1">{errors.cookTime}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Difficulty</label>
              <select value={form.difficulty} onChange={e => updateForm('difficulty', e.target.value)} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400">
                {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Servings</label>
              <input type="number" min="1" value={form.servings} onChange={e => updateForm('servings', e.target.value)} className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-gray-800">Ingredients</h2>
            <button type="button" onClick={addIngredient} className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100">
              <Plus size={16} /> Add Ingredient
            </button>
          </div>
          {errors.ingredients && <p className="text-xs text-red-500 mb-3">{errors.ingredients}</p>}
          <div className="space-y-3">
            <AnimatePresence>
              {ingredients.map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-3 items-center"
                >
                  <input
                    type="text"
                    value={ing.name}
                    onChange={e => updateIngredient(idx, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1 px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="text"
                    value={ing.quantity}
                    onChange={e => updateIngredient(idx, 'quantity', e.target.value)}
                    placeholder="Qty"
                    className="w-20 px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                    placeholder="Unit"
                    className="w-24 px-3 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
                  />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                      <X size={18} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl border border-cream-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold text-gray-800">Cooking Instructions</h2>
            <button type="button" onClick={addInstruction} className="flex items-center gap-1.5 px-4 py-2 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium hover:bg-orange-100">
              <Plus size={16} /> Add Step
            </button>
          </div>
          {errors.instructions && <p className="text-xs text-red-500 mb-3">{errors.instructions}</p>}
          <div className="space-y-3">
            <AnimatePresence>
              {instructions.map((inst, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-3 items-start"
                >
                  <span className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <textarea
                    value={inst.step}
                    onChange={e => updateInstruction(idx, 'step', e.target.value)}
                    placeholder={`Describe step ${idx + 1}...`}
                    rows={2}
                    className="flex-1 px-4 py-2.5 bg-cream-50 border border-cream-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 resize-none"
                  />
                  {instructions.length > 1 && (
                    <button type="button" onClick={() => removeInstruction(idx)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg mt-1">
                      <X size={18} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-6 py-3.5 bg-white border border-cream-300 rounded-xl font-medium text-gray-600 hover:bg-cream-50"
          >
            <Eye size={18} /> {showPreview ? 'Hide Preview' : 'Preview'}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:scale-[1.01] transition-transform disabled:opacity-60"
          >
            <Save size={18} /> {loading ? 'Submitting...' : 'Submit Recipe'}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">Recipe Preview</h2>
              <div className={`bg-gradient-to-br ${recipeGradients[form.title] || 'from-orange-400 to-red-400'} rounded-2xl h-48 flex items-center justify-center mb-4`}>
                <span className="text-7xl">{recipeEmojis[form.title] || '🍽️'}</span>
              </div>
              <h3 className="font-display text-xl font-bold">{form.title || 'Untitled Recipe'}</h3>
              <p className="text-gray-500 text-sm mt-1">{form.description || 'No description'}</p>
              <div className="flex gap-3 mt-3 text-xs text-gray-500">
                <span>⏱ {form.prepTime || 0} + {form.cookTime || 0} min</span>
                <span>🍽 {form.servings} servings</span>
                <span>📊 {form.difficulty}</span>
                <span className="capitalize">{form.foodType}</span>
              </div>
              <h4 className="font-bold mt-4 mb-2">Ingredients:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {ingredients.filter(i => i.name).map((i, idx) => <li key={idx}>• {i.name} - {i.quantity} {i.unit}</li>)}
              </ul>
              <h4 className="font-bold mt-4 mb-2">Instructions:</h4>
              <ol className="text-sm text-gray-600 space-y-2">
                {instructions.filter(i => i.step).map((i, idx) => <li key={idx}>{idx + 1}. {i.step}</li>)}
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
