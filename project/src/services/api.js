// Axios service layer - prepared for future backend integration
// Currently uses local data, but structured for seamless API switch

import { recipes as localRecipes } from '../data/recipes'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Simulate async API calls with local data
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const recipeService = {
  async getAllRecipes(filters = {}) {
    await delay()
    let result = [...localRecipes]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    }
    if (filters.cuisine && filters.cuisine !== 'all') {
      result = result.filter(r => r.cuisine === filters.cuisine)
    }
    if (filters.foodType && filters.foodType !== 'all') {
      result = result.filter(r => r.foodType === filters.foodType)
    }
    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'Vegetarian') result = result.filter(r => r.foodType === 'vegetarian')
      else if (filters.category === 'Non-Vegetarian') result = result.filter(r => r.foodType === 'non-vegetarian')
      else if (filters.category === 'Healthy Food') result = result.filter(r => r.rating >= 4.5 && r.foodType === 'vegetarian')
      else if (filters.category === 'Traditional Indian Food') result = result.filter(r => r.cuisine === 'Indian')
      else result = result.filter(r => r.category === filters.category)
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      result = result.filter(r => r.difficulty === filters.difficulty)
    }
    if (filters.maxCookTime && filters.maxCookTime !== 'all') {
      const max = parseInt(filters.maxCookTime)
      result = result.filter(r => r.cookTime <= max)
    }
    if (filters.sort) {
      if (filters.sort === 'popular') result.sort((a, b) => b.rating - a.rating)
      else if (filters.sort === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating)
      else if (filters.sort === 'quick') result.sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime))
    }
    return result
  },

  async getRecipeById(id) {
    await delay()
    return localRecipes.find(r => r.id === parseInt(id)) || null
  },

  async getTrendingRecipes() {
    await delay()
    return localRecipes.filter(r => r.trending)
  },

  async getPopularRecipes() {
    await delay()
    return localRecipes.filter(r => r.popular)
  },

  async getRelatedRecipes(id, limit = 4) {
    await delay()
    const recipe = localRecipes.find(r => r.id === parseInt(id))
    if (!recipe) return []
    return localRecipes
      .filter(r => r.id !== recipe.id && (r.cuisine === recipe.cuisine || r.category === recipe.category))
      .slice(0, limit)
  },

  async findRecipesByIngredients(ingredientNames) {
    await delay()
    const normalized = ingredientNames.map(i => i.toLowerCase().trim())
    return localRecipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase())
      const matched = normalized.filter(n => recipeIngredients.some(ri => ri.includes(n) || n.includes(ri)))
      const missing = recipe.ingredients.filter(i =>
        !normalized.some(n => {
          const ri = i.name.toLowerCase()
          return ri.includes(n) || n.includes(ri)
        })
      )
      const matchPercentage = Math.round((matched.length / normalized.length) * 100)
      return { ...recipe, matchedIngredients: matched, missingIngredients: missing, matchPercentage }
    }).filter(r => r.matchPercentage > 0).sort((a, b) => b.matchPercentage - a.matchPercentage)
  },

  async submitRecipe(recipeData) {
    await delay(500)
    const userRecipes = JSON.parse(localStorage.getItem('savoria_user_recipes') || '[]')
    const newRecipe = {
      ...recipeData,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      trending: false,
      popular: false,
      createdAt: new Date().toISOString(),
    }
    userRecipes.push(newRecipe)
    localStorage.setItem('savoria_user_recipes', JSON.stringify(userRecipes))
    return { success: true, recipe: newRecipe }
  },

  async getUserRecipes() {
    await delay()
    return JSON.parse(localStorage.getItem('savoria_user_recipes') || '[]')
  },
}

export const authService = {
  async login(email, password) {
    await delay(500)
    const users = JSON.parse(localStorage.getItem('savoria_users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      const { password: _pw, ...safeUser } = user
      return { success: true, user: safeUser }
    }
    return { success: false, message: 'Invalid credentials' }
  },

  async register(data) {
    await delay(500)
    const users = JSON.parse(localStorage.getItem('savoria_users') || '[]')
    if (users.find(u => u.email === data.email)) {
      return { success: false, message: 'Email already registered' }
    }
    return { success: true }
  },
}

export default { recipeService, authService, API_BASE_URL }
