export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto sm:px-6">
        {children}
      </div>
    </div>
  )
}
