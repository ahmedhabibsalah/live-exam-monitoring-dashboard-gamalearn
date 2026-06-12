'use client'

import { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectAllSessions } from '@/store/slices/sessionsSlice'
import type { ExamSession } from '@/types'

interface HeatmapCell {
  examName: string
  country: string
  avgRisk: number
  count: number
  criticalCount: number
}

function buildHeatmapData(sessions: ExamSession[]): {
  cells: HeatmapCell[]
  exams: string[]
  countries: string[]
} {
  const map = new Map<
    string,
    { total: number; count: number; critical: number }
  >()

  sessions.forEach((s) => {
    const key = `${s.examName}|||${s.candidate.country}`
    const existing = map.get(key) || { total: 0, count: 0, critical: 0 }
    map.set(key, {
      total: existing.total + s.riskScore,
      count: existing.count + 1,
      critical: existing.critical + (s.riskLevel === 'critical' ? 1 : 0),
    })
  })

  const cells: HeatmapCell[] = []
  map.forEach((val, key) => {
    const [examName, country] = key.split('|||')
    cells.push({
      examName,
      country,
      avgRisk: Math.round(val.total / val.count),
      count: val.count,
      criticalCount: val.critical,
    })
  })

  const exams = [...new Set(cells.map((c) => c.examName))].slice(0, 8)
  const countries = [...new Set(cells.map((c) => c.country))]
    .sort((a, b) => {
      const aTotal = cells
        .filter((c) => c.country === a)
        .reduce((s, c) => s + c.avgRisk, 0)
      const bTotal = cells
        .filter((c) => c.country === b)
        .reduce((s, c) => s + c.avgRisk, 0)
      return bTotal - aTotal
    })
    .slice(0, 12)

  return { cells, exams, countries }
}

export function RiskHeatmap() {
  const svgRef = useRef<SVGSVGElement>(null)
  const sessions = useAppSelector(selectAllSessions)

  const { cells, exams, countries } = useMemo(
    () => buildHeatmapData(sessions),
    [sessions]
  )

  useEffect(() => {
    if (!svgRef.current || cells.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 20, bottom: 80, left: 130 }
    const containerWidth = svgRef.current.parentElement?.clientWidth || 600
    const width = containerWidth - margin.left - margin.right
    const cellSize = Math.max(28, Math.min(48, width / exams.length))
    const height = countries.length * cellSize

    svg
      .attr('width', containerWidth)
      .attr('height', height + margin.top + margin.bottom)

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand()
      .domain(exams)
      .range([0, exams.length * cellSize])
      .padding(0.05)
    const y = d3.scaleBand().domain(countries).range([0, height]).padding(0.05)

    const colorScale = d3
      .scaleSequential()
      .domain([0, 100])
      .interpolator(d3.interpolateRgb('#1a2340', '#ef4444'))

    // Cells
    const cellMap = new Map(
      cells.map((c) => [`${c.examName}|||${c.country}`, c])
    )

    exams.forEach((exam) => {
      countries.forEach((country) => {
        const cell = cellMap.get(`${exam}|||${country}`)
        const risk = cell?.avgRisk ?? 0

        const rect = g
          .append('rect')
          .attr('x', x(exam) ?? 0)
          .attr('y', y(country) ?? 0)
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .attr('rx', 3)
          .attr('fill', risk > 0 ? colorScale(risk) : '#151d35')
          .attr('stroke', '#1e2a45')
          .attr('stroke-width', 1)
          .style('cursor', risk > 0 ? 'pointer' : 'default')

        if (risk > 0) {
          rect
            .on('mouseover', function (event) {
              d3.select(this).attr('stroke', '#3b82f6').attr('stroke-width', 2)

              tooltip
                .style('opacity', 1)
                .html(
                  `
                  <div style="font-weight:600;margin-bottom:4px">${country}</div>
                  <div style="color:#94a3b8;font-size:11px;margin-bottom:6px">${exam}</div>
                  <div>Avg Risk: <span style="color:${colorScale(risk)};font-weight:600">${risk}</span></div>
                  <div>Sessions: <span style="font-weight:600">${cell?.count ?? 0}</span></div>
                  <div>Critical: <span style="color:#ef4444;font-weight:600">${cell?.criticalCount ?? 0}</span></div>
                `
                )
                .style('left', `${event.offsetX + 12}px`)
                .style('top', `${event.offsetY - 10}px`)
            })
            .on('mousemove', function (event) {
              tooltip
                .style('left', `${event.offsetX + 12}px`)
                .style('top', `${event.offsetY - 10}px`)
            })
            .on('mouseout', function () {
              d3.select(this).attr('stroke', '#1e2a45').attr('stroke-width', 1)
              tooltip.style('opacity', 0)
            })
        }

        // Risk number label
        if (risk > 0) {
          g.append('text')
            .attr('x', (x(exam) ?? 0) + x.bandwidth() / 2)
            .attr('y', (y(country) ?? 0) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('font-family', 'monospace')
            .attr('fill', risk > 50 ? '#fff' : '#94a3b8')
            .attr('pointer-events', 'none')
            .text(risk)
        }
      })
    })

    // X axis — exam names
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0))
      .select('.domain')
      .remove()

    g.selectAll('.tick text')
      .style('fill', '#64748b')
      .style('font-size', '10px')
      .attr('dy', '1.2em')
      .call((sel) => {
        sel.each(function () {
          const text = d3.select(this)
          const words = (text.text() || '').split(' ')
          text.text(null)
          words.forEach((word, i) => {
            text
              .append('tspan')
              .attr('x', 0)
              .attr('dy', i === 0 ? '1.2em' : '1.1em')
              .text(word)
          })
        })
      })

    // Y axis — countries
    g.append('g').call(d3.axisLeft(y).tickSize(0)).select('.domain').remove()

    g.selectAll('.tick text')
      .style('fill', '#94a3b8')
      .style('font-size', '11px')
      .attr('dx', '-8px')

    // Tooltip
    const tooltipEl = svgRef.current.parentElement
    const tooltip = d3
      .select(tooltipEl)
      .selectAll<HTMLDivElement, unknown>('.heatmap-tooltip')
      .data([null])
      .join('div')
      .attr('class', 'heatmap-tooltip')
      .style('position', 'absolute')
      .style('background', '#0f1629')
      .style('border', '1px solid #243050')
      .style('border-radius', '6px')
      .style('padding', '10px 12px')
      .style('font-size', '12px')
      .style('color', '#e2e8f0')
      .style('pointer-events', 'none')
      .style('opacity', '0')
      .style('transition', 'opacity 0.15s')
      .style('z-index', '100')
      .style('min-width', '160px')
  }, [cells, exams, countries])

  if (sessions.length === 0) return null

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
      <svg ref={svgRef} />
    </div>
  )
}
