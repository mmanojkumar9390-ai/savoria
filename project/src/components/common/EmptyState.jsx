export default function EmptyState({ icon = '🍽️', title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-7xl mb-6 opacity-60">{icon}</div>
      <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mb-6">{message}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
