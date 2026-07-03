export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center mb-4">
          <Icon size={24} className="text-teal-500" />
        </div>
      )}
      <h3 className="font-display text-xl font-medium text-ink mb-1">{title}</h3>
      {message && <p className="text-ink/60 text-sm max-w-sm mb-5">{message}</p>}
      {action}
    </div>
  );
}
