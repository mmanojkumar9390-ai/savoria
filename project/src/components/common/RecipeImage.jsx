import { recipeGradients, recipeEmojis } from '../../data/recipeImages'

export default function RecipeImage({ recipe, size = 'md', className = '' }) {
  const gradient = recipeGradients[recipe.title] || 'from-orange-400 via-red-400 to-amber-400'
  const emoji = recipeEmojis[recipe.title] || '🍽️'

  const sizeClasses = {
    sm: 'text-4xl rounded-xl',
    md: 'text-6xl rounded-2xl',
    lg: 'text-8xl rounded-3xl',
    xl: 'text-9xl rounded-3xl',
  }

  return (
    <div className={`relative bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,0,0,0.2) 0%, transparent 50%)'
      }} />
      <span className="relative z-10 drop-shadow-lg" style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))' }}>
        {emoji}
      </span>
    </div>
  )
}
