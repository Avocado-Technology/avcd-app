export default async function TestSkeletonPage() {
  // Simulate slow data fetch
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return (
    <div style={{ 
      padding: 'var(--sp-6)', 
      textAlign: 'center',
      fontFamily: 'var(--sans)',
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 600, 
        color: 'var(--g900)',
        marginBottom: 'var(--sp-4)',
      }}>
        Test Content Loaded
      </h1>
      <p style={{ color: 'var(--g500)' }}>
        The skeleton was displayed while this page loaded.
      </p>
    </div>
  )
}
