export default function BackgroundWaves() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg className="absolute w-full h-full opacity-10" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,500 C150,400 250,300 500,300 C750,300 850,400 1000,300 L1000,1000 L0,1000 Z" fill="#9CA3AF" />
        <path d="M0,600 C150,500 250,400 500,400 C750,400 850,500 1000,400 L1000,1000 L0,1000 Z" fill="#6B7280" />
        <path d="M0,700 C150,600 250,500 500,500 C750,500 850,600 1000,500 L1000,1000 L0,1000 Z" fill="#4B5563" />
        <path d="M0,800 C150,700 250,600 500,600 C750,600 850,700 1000,600 L1000,1000 L0,1000 Z" fill="#374151" />
      </svg>
    </div>
  )
}
