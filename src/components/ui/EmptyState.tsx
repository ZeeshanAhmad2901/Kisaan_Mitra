interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="px-4 py-12 text-center border border-gray-200 rounded-lg bg-gray-50">
      <span className="text-5xl">{icon}</span>
      <h3 className="mt-4 font-medium text-gray-900">{title}</h3>
      {description && <p className="max-w-sm mx-auto mt-1 text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState
