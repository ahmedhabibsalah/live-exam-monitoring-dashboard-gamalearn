import { SearchX } from 'lucide-react'

interface Props {
  title: string
  description: string
}

export function EmptyState({ title, description }: Props) {
  return (
    <div
      role="status"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SearchX
          style={{ width: 22, height: 22, color: 'var(--text-muted)' }}
        />
      </div>
      <div>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}
        >
          {title}
        </p>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {description}
        </p>
      </div>
    </div>
  )
}
