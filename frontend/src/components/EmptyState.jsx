export default function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-[#171717] border border-[#2C2C2C] flex items-center justify-center mb-5">
          <Icon size={26} className="text-[#D4AF37]" />
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {message && (
        <p className="text-gray-400 text-sm max-w-sm mb-6">{message}</p>
      )}
      {action}
    </div>
  );
}