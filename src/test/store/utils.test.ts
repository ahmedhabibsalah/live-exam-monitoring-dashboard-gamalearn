import { describe, it, expect } from 'vitest'
import { formatDuration, getRiskLevel, formatTimestamp } from '@/lib/utils'

describe('formatDuration', () => {
  it('formats seconds only', () => {
    expect(formatDuration(45)).toBe('45s')
  })

  it('formats minutes and seconds', () => {
    expect(formatDuration(125)).toBe('2m 5s')
  })

  it('formats hours and minutes', () => {
    expect(formatDuration(3661)).toBe('1h 1m')
  })

  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0s')
  })
})

describe('getRiskLevel', () => {
  it('returns low for score below 40', () => {
    expect(getRiskLevel(0)).toBe('low')
    expect(getRiskLevel(39)).toBe('low')
  })

  it('returns medium for score 40-59', () => {
    expect(getRiskLevel(40)).toBe('medium')
    expect(getRiskLevel(59)).toBe('medium')
  })

  it('returns high for score 60-79', () => {
    expect(getRiskLevel(60)).toBe('high')
    expect(getRiskLevel(79)).toBe('high')
  })

  it('returns critical for score 80+', () => {
    expect(getRiskLevel(80)).toBe('critical')
    expect(getRiskLevel(100)).toBe('critical')
  })
})

describe('formatTimestamp', () => {
  it('formats ISO string to HH:MM:SS', () => {
    const result = formatTimestamp('2026-01-01T14:30:45Z')
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/)
  })
})
