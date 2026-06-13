import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })
import { createClient } from '@supabase/supabase-js'
import { generateSessions } from './mockData'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function seed() {
  console.log('Generating 15,000 sessions...')
  const { sessions, events } = generateSessions(15000)
  // Map to DB shape
  const dbSessions = sessions.map((s) => ({
    id: s.id,
    candidate: s.candidate,
    exam_id: s.examId,
    exam_name: s.examName,
    status: s.status,
    risk_score: s.riskScore,
    risk_level: s.riskLevel,
    started_at: s.startedAt,
    duration: s.duration,
    flag_count: s.flagCount,
    critical_flag_count: s.criticalFlagCount,
    last_event_at: s.lastEventAt,
    proctor_id: s.proctorId,
    notes: s.notes,
  }))

  // Insert sessions in batches of 500
  console.log('Seeding sessions...')
  for (let i = 0; i < dbSessions.length; i += 500) {
    const batch = dbSessions.slice(i, i + 500)
    const { error } = await supabase.from('sessions').upsert(batch)
    if (error) {
      console.error(`Batch ${i / 500 + 1} error:`, error.message)
    } else {
      console.log(`Sessions batch ${i / 500 + 1}/20 done`)
    }
  }

  // Insert events in batches of 500
  console.log('Seeding events...')
  const allEvents = Array.from(events.values()).flat()
  for (let i = 0; i < allEvents.length; i += 500) {
    const batch = allEvents.slice(i, i + 500).map((e) => ({
      id: e.id,
      session_id: e.sessionId,
      type: e.type,
      severity: e.severity,
      message: e.message,
      timestamp: e.timestamp,
      metadata: e.metadata ?? null,
    }))
    const { error } = await supabase.from('session_events').upsert(batch)
    if (error) {
      console.error(`Events batch error:`, error.message)
    } else {
      console.log(`Events batch ${i / 500 + 1} done`)
    }
  }

  console.log('Seed complete.')
}

seed()
