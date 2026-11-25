// Utility functions for SAVORIA

export function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hrs} hr` : `${hrs} hr ${mins} min`
}

export function getTotalTime(recipe) {
  return recipe.prepTime + recipe.cookTime
}

export function getDifficultyColor(difficulty) {
  if (difficulty === 'Easy') return 'text-forest-600 bg-forest-50 border-forest-200'
  if (difficulty === 'Medium') return 'text-orange-600 bg-orange-50 border-orange-200'
  return 'text-red-600 bg-red-50 border-red-200'
}

export function getFoodTypeColor(foodType) {
  if (foodType === 'vegetarian') return 'text-forest-700 bg-forest-100 border-forest-300'
  return 'text-red-700 bg-red-100 border-red-300'
}

export function getFoodTypeIcon(foodType) {
  return foodType === 'vegetarian' ? '🟢' : '🔴'
}

export function adjustIngredients(ingredients, originalServings, newServings) {
  const ratio = newServings / originalServings
  return ingredients.map(i => ({
    ...i,
    quantity: typeof i.quantity === 'number'
      ? Math.round(i.quantity * ratio * 100) / 100
      : i.quantity,
  }))
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePassword(password) {
  return password && password.length >= 6
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function shareRecipe(recipe) {
  const url = `${window.location.origin}/recipes/${recipe.id}`
  if (navigator.share) {
    navigator.share({ title: recipe.title, text: recipe.description, url })
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url)
  }
}
