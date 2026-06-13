# ExamGuard — Live Exam Monitoring Dashboard

> Senior Frontend Engineer Technical Assessment — Ahmed Habib

**Live Demo:** https://live-exam-monitoring-dashboard-gama.vercel.app/  
**Repository:** https://github.com/ahmedhabibsalah/live-exam-monitoring-dashboard-gamalearn  
**Figma:** <!-- Add Figma URL here -->  
**Walkthrough Recording:** <!-- Add recording URL here -->

---

## Overview

ExamGuard is a production-grade live exam monitoring dashboard built for remote proctors managing thousands of concurrent exam sessions. The platform enables proctors to track candidate status, identify suspicious activity, and intervene on high-risk sessions in real time.

**Primary users:** Exam proctors and operations supervisors  
**Core objective:** Fast, accurate monitoring under real-time load at scale  
**Constraint:** Full usability on both desktop and mobile

---

## Tech Stack

| Concern        | Choice                         | Rationale                                                                                       |
| -------------- | ------------------------------ | ----------------------------------------------------------------------------------------------- |
| Framework      | Next.js 14 (App Router)        | Required. Server components for layout, client components for interactivity                     |
| Language       | TypeScript (strict mode)       | Type safety across the entire data pipeline from DB to UI                                       |
| State          | Redux Toolkit + RTK            | Predictable store design, normalized state, memoized selectors via `createSelector`             |
| Realtime       | Supabase Realtime (WebSocket)  | Managed WebSocket with Postgres change events, free tier, production-grade                      |
| Virtualization | TanStack Virtual               | Handles 14k+ records in both grid and list views without DOM bloat                              |
| Visualization  | D3.js                          | Risk heatmap with exam × country matrix, hover tooltips, dynamic color scaling                  |
| Styling        | Tailwind CSS + inline styles   | Tailwind v4 responsive prefix limitations required inline styles for layout-critical components |
| Testing        | Vitest + React Testing Library | Unit tests for Redux slices, filter logic, and utility functions                                |
| Deployment     | Vercel                         | Zero-config Next.js deployment                                                                  |

---

## Architecture

src/

├── app/ # Next.js App Router pages

│ ├── page.tsx # Monitor view — main dashboard

│ └── analytics/ # Analytics view — heatmap + alerts

├── components/

│ ├── dashboard/ # Feature components (Navbar, FilterBar, SessionsList, etc.)

│ └── ui/ # Primitive components (StatusBadge, RiskBadge, etc.)

├── store/

│ ├── index.ts # Store configuration

│ ├── types.ts # Shared state types (avoids circular imports)

│ └── slices/ # sessions, filters, ui

├── hooks/ # useHydrateSessions, useRealtimeSession, useDebounce, etc.

├── lib/ # supabase client, utils, mockData generator, seed script

├── types/ # Domain types (ExamSession, SessionEvent, etc.)

├── constants/ # Event weights, labels, status maps

└── test/ # Vitest test suites

### State Architecture

Three Redux slices with clear boundaries:

- **sessions** — server state. Holds all session records, events, and selected session. Updated by realtime events.
- **filters** — UI state. Search, status, risk level, sort field, sort order. Drives `selectFilteredSessions` memoized selector.
- **ui** — UI state. Panel view, sidebar, detail panel open state, realtime connection status.

Server state and UI state are explicitly separated. Realtime events update server state only — UI state is never mutated by incoming data.

---

## Features

### Core Dashboard

- **14,937 sessions** loaded via paginated Supabase fetch (1,000 rows per request × 15 pages)
- **Grid and list views** — both fully virtualized with TanStack Virtual
- **Real-time filtering** — search (debounced 300ms), status, risk level, sort field, sort direction
- **Session count** updates live as filters change

### Realtime

- Supabase Realtime WebSocket subscription on `sessions` and `session_events` tables
- Live status changes and flag events update the UI without refresh
- Connection health indicator in navbar (Live / Reconnecting...)
- Graceful reconnect handling via Supabase channel management

### Session Detail Panel

- Slide-in drawer on session click
- Risk score hero with color-coded severity
- Candidate info, exam details, connection status
- **Incident timeline** — all events sorted by recency, severity-coded
- **Risk breakdown** — per-event-type contribution bars showing what drove the score
- Lazy event loading — events fetched from Supabase on demand per session

### Analytics Page

- **D3 Risk Heatmap** — exam × country matrix showing average risk concentration. Darker red = higher risk. Hover tooltips show avg risk, session count, critical count.
- **Priority Alerts feed** — top 8 highest-risk sessions requiring immediate attention
- Summary stats row — total, active, flagged, critical, avg risk score

### Edge Features

- **Notifications drawer** — bell icon in navbar opens a live alert feed of critical sessions
- **Smart risk scoring** — weighted event scoring system (face not detected = 8pts, multiple faces = 10pts, etc.)
- **SOC-style dark theme** — designed for low-light operations environments, not generic SaaS aesthetics

---

## Performance Decisions

### Virtualization

Both grid and list views use TanStack Virtual — only visible DOM nodes are rendered regardless of total session count. Grid uses a `ResizeObserver` to dynamically calculate column count and virtualizes by row.

### Paginated Hydration

Supabase enforces a 1,000-row server limit per request. Initial load paginates across up to 15 pages using `.range()` to fetch all 14k+ records without hitting the cap.

### Debounced Search

Search input dispatches to Redux after a 300ms debounce. Without this, every keystroke reruns `selectFilteredSessions` across 14k items.

### Memoized Selectors

`selectFilteredSessions` and `selectDashboardStats` use `createSelector` — they only recompute when their input selectors change. Realtime updates to a single session don't trigger full list refiltering.

### React.memo + useCallback

`SessionCard` and `SessionRow` are wrapped in `React.memo`. Click handlers in `SessionsList` use `useCallback`. This prevents unnecessary re-renders during high-frequency realtime updates.

---

## Realtime Architecture

Supabase Postgres

│

│ Postgres Change Events (INSERT/UPDATE)

▼

Supabase Realtime Channel ("exam-monitor")

│

├── sessions UPDATE → dispatch(updateSession)

│ → dispatch(setLastRealtimeEvent)

│

└── session_events INSERT → dispatch(addEvent)

→ updates session flagCount/criticalFlagCount

→ dispatch(setLastRealtimeEvent)

Connection status is tracked in the `ui` slice and displayed in the navbar. Disconnection is detected via the Supabase channel subscription callback and reflected immediately in the UI.

---

## Data Model

### ExamSession

```ts
{
  id, candidate, examId, examName,
  status: 'active' | 'idle' | 'disconnected' | 'flagged' | 'completed',
  riskScore: number,        // 0-100, calculated from weighted suspicious events
  riskLevel: 'low' | 'medium' | 'high' | 'critical',
  startedAt, duration, flagCount, criticalFlagCount,
  lastEventAt, proctorId, notes
}
```

### Risk Scoring

tab_switch: +3 pts

face_not_detected: +8 pts

multiple_faces: +10 pts

phone_detected: +9 pts

audio_detected: +4 pts

screen_share_stopped: +6 pts

connection_drop: +2 pts

Max score: 100 (capped)

---

## Setup

### Prerequisites

- Node.js 18+
- A Supabase project with the schema below

### Supabase Schema

```sql
create table sessions (
  id text primary key,
  candidate jsonb not null,
  exam_id text not null,
  exam_name text not null,
  status text not null,
  risk_score integer not null default 0,
  risk_level text not null default 'low',
  started_at timestamptz not null,
  duration integer not null default 0,
  flag_count integer not null default 0,
  critical_flag_count integer not null default 0,
  last_event_at timestamptz not null,
  proctor_id text,
  notes text[] default '{}'
);

create table session_events (
  id text primary key,
  session_id text references sessions(id) on delete cascade,
  type text not null,
  severity text not null,
  message text not null,
  timestamp timestamptz not null,
  metadata jsonb
);

alter publication supabase_realtime add table sessions;
alter publication supabase_realtime add table session_events;
```

### Installation

```bash
git clone https://github.com/ahmedhabibsalah/live-exam-monitoring-dashboard-gamalearn
cd live-exam-monitoring-dashboard-gamalearn
npm install
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Seed the Database

```bash
npm run seed
```

Generates and inserts 15,000 sessions with realistic variance across statuses, risk levels, and event types.

### Run

```bash
npm run dev
```

### Test

```bash
npm run test:run
```

---

## Known Tradeoffs

| Decision                    | Tradeoff                                                                                                                                             |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| RLS disabled on Supabase    | Simplifies demo setup. In production, row-level policies would restrict reads to authenticated proctors only                                         |
| Inline styles over Tailwind | Tailwind v4 changed responsive prefix behavior — inline styles were required for layout-critical components to ensure consistent rendering           |
| Client-side filtering       | All 14k records are filtered in-browser via memoized selectors. At 100k+ sessions, server-side filtering with query params would be more appropriate |
| Mock data generator         | Risk scores and session distributions are randomly generated. A real system would derive these from actual proctoring event streams                  |
| No authentication           | Out of scope for the assessment. In production, JWT-based auth with role separation (proctor vs supervisor) would gate access                        |

---

## AI Usage

This project was built with Claude (Anthropic) as an AI assistant. The following is an honest account of how AI was used and where human judgment drove the work.

### What AI assisted with

- **Code generation** — implementing decisions and specifications into working code (Redux slices, hook patterns, component structure)
- **Mock data generator** — generating realistic exam session data with weighted distributions
- **Boilerplate acceleration** — Redux store setup, Supabase client configuration, Vitest config
- **Debugging suggestions** — proposed fixes for issues (not always correct — required validation and correction)

### What I decided and drove

- **Architecture** — choosing Next.js App Router, Redux Toolkit over Zustand/MobX, Supabase over Firebase/Pusher, TanStack Virtual over react-window
- **Performance strategy** — identifying the virtualization approach, debounced search, paginated fetch pattern, and React.memo boundaries
- **Data modeling** — risk scoring weights, event severity mapping, session status distribution
- **UI/UX direction** — SOC aesthetic, dark theme, grid/list toggle, detail panel layout, D3 heatmap as an edge feature
- **Testing scope** — deciding what to test and why (slice reducers, filter logic, utility functions)
- **Debugging** — resolving Supabase 1,000-row limit, Tailwind v4 responsive prefix failures, TanStack Virtual positioning with absolute-positioned elements, duplicate session IDs from multiple seed runs
- **Quality gates** — reviewing all AI output, rejecting incorrect suggestions, validating against requirements

AI accelerated implementation. All technical decisions, architectural choices, and quality judgments were made by me.

---

## Evaluation Checklist

- ✅ Next.js 14 (App Router) + TypeScript strict
- ✅ Redux Toolkit with clear server/UI state boundaries
- ✅ Supabase Realtime WebSocket integration with reconnect handling
- ✅ 14,937 records with virtualized rendering (grid + list)
- ✅ Filter, sort, search on operationally useful fields
- ✅ Session detail with incident timeline and risk breakdown
- ✅ D3 risk heatmap (edge feature)
- ✅ Priority alerts + notifications drawer (edge feature)
- ✅ Desktop and mobile layouts
- ✅ Accessibility — semantic HTML, aria attributes, keyboard navigation
- ✅ Loading, empty, and error states
- ✅ Vitest test suite
- ✅ Hosted deployment on Vercel
- ✅ GitHub repository
- ✅ README with setup, architecture, decisions, tradeoffs, AI usage
- ⬜ Figma file <!-- Add when complete -->
- ⬜ Walkthrough recording <!-- Add when complete -->
