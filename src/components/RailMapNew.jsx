import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function hashNumber(str){
  let h = 2166136261 >>> 0
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

// Красивая детальная инлайн-графика локомотива в корпоративных цветах РЖД
const LocomotiveSVG = () => (
  <svg width="60" height="28" viewBox="0 0 60 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow base / tracks shadow */}
    <rect x="2" y="24" width="56" height="3" rx="1.5" fill="#1e293b" opacity="0.4" />
    
    {/* Main locomotive body - sleek gray and red */}
    <path d="M4 6 C4 4, 12 4, 18 4 L42 4 C48 4, 52 6, 56 10 L58 14 C59 16, 59 18, 57 20 C55 22, 52 23, 44 23 L6 23 C4 23, 4 21, 4 20 Z" fill="#334155" />
    
    {/* RZD Red section / cabin accent */}
    <path d="M28 4 L44 4 C48 4, 51 6, 54 9 L56 13 L22 13 Z" fill="#E30613" />
    <path d="M4 14 H57 V21 H4 Z" fill="#E30613" />
    <rect x="6" y="21" width="48" height="2" fill="#E2E8F0" />
    
    {/* Windshield / Cab windows */}
    <path d="M45 5 L51 5 C53.5 5, 54.5 6, 55.5 8 L54 12 H42 Z" fill="#93c5fd" stroke="#1e293b" strokeWidth="1" />
    {/* Side cabin windows */}
    <rect x="34" y="6" width="6" height="5" rx="1" fill="#93c5fd" stroke="#1e293b" strokeWidth="1" />
    <rect x="26" y="6" width="5" height="5" rx="1" fill="#93c5fd" stroke="#1e293b" strokeWidth="1" />
    
    {/* Headlights / Glowing forward light */}
    <circle cx="56" cy="17" r="2.5" fill="#ffedd5" />
    <circle cx="56" cy="17" r="1" fill="#ffffff" />
    <circle cx="54" cy="20" r="1.5" fill="#fef08a" />
    {/* Glowing light beam effect */}
    <path d="M57 17 L72 11 L72 23 Z" fill="url(#lightGlow)" opacity="0.25" />
    
    {/* Wheels */}
    <circle cx="12" cy="23" r="4.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="12" cy="23" r="1.5" fill="#475569" />
    <circle cx="21" cy="23" r="4.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="21" cy="23" r="1.5" fill="#475569" />
    <circle cx="39" cy="23" r="4.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="39" cy="23" r="1.5" fill="#475569" />
    <circle cx="48" cy="23" r="4.5" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="48" cy="23" r="1.5" fill="#475569" />
    
    {/* Train coupler on back */}
    <rect x="0" y="18" width="4" height="2" rx="0.5" fill="#475569" />
    
    <defs>
      <linearGradient id="lightGlow" x1="57" y1="17" x2="72" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#fef08a" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)

const WagonSVG = ({ title = "" }) => (
  <svg width="58" height="28" viewBox="0 0 58 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Shadow base */}
    <rect x="2" y="24" width="54" height="3" rx="1.5" fill="#1e293b" opacity="0.4" />
    
    {/* Main carriage body - RZD style light gray with red stripe */}
    <rect x="4" y="4" width="50" height="19" rx="3" fill="#cbd5e1" />
    <rect x="4" y="11" width="50" height="4" fill="#E30613" />
    
    {/* Windows - sleek and spaced out */}
    <rect x="8" y="6" width="7" height="4" rx="1" fill="#334155" />
    <rect x="18" y="6" width="7" height="4" rx="1" fill="#334155" />
    <rect x="28" y="6" width="7" height="4" rx="1" fill="#334155" />
    <rect x="38" y="6" width="7" height="4" rx="1" fill="#334155" />
    <rect x="46" y="6" width="4" height="4" rx="1" fill="#334155" />
    
    {/* Wheel blocks and wheels */}
    <circle cx="14" cy="23" r="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="14" cy="23" r="1.2" fill="#475569" />
    <circle cx="21" cy="23" r="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="21" cy="23" r="1.2" fill="#475569" />
    
    <circle cx="37" cy="23" r="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="37" cy="23" r="1.2" fill="#475569" />
    <circle cx="44" cy="23" r="4" fill="#1e293b" stroke="#94a3b8" strokeWidth="1" />
    <circle cx="44" cy="23" r="1.2" fill="#475569" />
    
    {/* Couplers on both sides - detailed metallic bumpers */}
    <rect x="0" y="17" width="4" height="2" rx="0.5" fill="#475569" />
    <rect x="54" y="17" width="4" height="2" rx="0.5" fill="#475569" />

    {/* Elegant dark signboard on the lower side of the wagon displaying structural station title */}
    {title && (
      <>
        <rect x="8" y="16" width="42" height="6.2" rx="1.5" fill="#1c2533" />
        <rect x="8" y="16" width="42" height="6.2" rx="1.5" stroke="#E30613" strokeWidth="0.4" fill="none" opacity="0.7" />
        <text 
          x="29" 
          y="20.8" 
          fill="#ffffff" 
          fontSize="4.4" 
          fontFamily="system-ui, -apple-system, Inter, sans-serif" 
          fontWeight="800" 
          textAnchor="middle"
          letterSpacing="0.1"
        >
          {title.toUpperCase()}
        </text>
      </>
    )}
  </svg>
)

// Вычисление приблизительной длины кубической кривой Безье
function cubicBezierLength(x1, y1, cx1, cy1, cx2, cy2, x2, y2, samples = 100) {
  let length = 0
  let prevX = x1, prevY = y1
  
  for (let i = 1; i <= samples; i++) {
    const t = i / samples
    const mt = 1 - t
    const x = mt*mt*mt*x1 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x2
    const y = mt*mt*mt*y1 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y2
    
    length += Math.hypot(x - prevX, y - prevY)
    prevX = x
    prevY = y
  }
  
  return length
}

// Нахождение параметра t по заданной длине дуги
function getParamAtArcLength(targetLength, x1, y1, cx1, cy1, cx2, cy2, x2, y2, maxSamples = 200) {
  let length = 0
  let prevX = x1, prevY = y1
  
  for (let i = 1; i <= maxSamples; i++) {
    const t = i / maxSamples
    const mt = 1 - t
    const x = mt*mt*mt*x1 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x2
    const y = mt*mt*mt*y1 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y2
    
    const segmentLength = Math.hypot(x - prevX, y - prevY)
    
    if (length + segmentLength >= targetLength) {
      // Линейная интерполяция между двумя точками
      const ratio = segmentLength > 0 ? (targetLength - length) / segmentLength : 0
      return (i - 1 + ratio) / maxSamples
    }
    
    length += segmentLength
    prevX = x
    prevY = y
  }
  
  return 1.0 // Если достигли конца
}

// Глобальный расчёт всех шпал для всего пути с равномерным распределением
function computeAllSleeperPositions(positions, makeOrganicPath, pointOnCubic, tangentOnCubic) {
  if (positions.length < 2) return []
  
  // Сначала вычисляем все сегменты пути с их длинами
  const segments = []
  let totalPathLength = 0
  
  for (let i = 1; i < positions.length; i++) {
    const info = makeOrganicPath(positions[i-1], positions[i], i)
    const pathLength = cubicBezierLength(info.x1, info.y1, info.cx1, info.cy1, info.cx2, info.cy2, info.x2, info.y2, 150)
    segments.push({
      index: i,
      info: info,
      length: pathLength,
      cumulativeStart: totalPathLength
    })
    totalPathLength += pathLength
  }
  
  if (totalPathLength === 0) return []
  
  // Фиксированное расстояние между шпалами (в пикселях)
  const sleeperSpacing = 25
  
  // Вычисляем позиции всех шпал на основе общей длины пути
  const allSleepers = []
  let currentArcLength = sleeperSpacing
  
  while (currentArcLength < totalPathLength) {
    // Найти сегмент, содержащий эту позицию
    let targetSegment = null
    let localArcLength = currentArcLength
    
    for (const seg of segments) {
      if (currentArcLength >= seg.cumulativeStart && currentArcLength < seg.cumulativeStart + seg.length) {
        targetSegment = seg
        localArcLength = currentArcLength - seg.cumulativeStart
        break
      }
    }
    
    if (!targetSegment) {
      currentArcLength += sleeperSpacing
      continue
    }
    
    // Вычисляем параметр t для этой длины в сегменте
    const t = getParamAtArcLength(localArcLength, 
      targetSegment.info.x1, targetSegment.info.y1, 
      targetSegment.info.cx1, targetSegment.info.cy1, 
      targetSegment.info.cx2, targetSegment.info.cy2, 
      targetSegment.info.x2, targetSegment.info.y2, 200)
    
    const pt = pointOnCubic(t, targetSegment.info)
    const tan = tangentOnCubic(t, targetSegment.info)
    let nx = -tan.dy
    let ny = tan.dx
    const len = Math.hypot(nx, ny) || 1
    nx /= len
    ny /= len
    
    const half = 10
    allSleepers.push({
      x1: pt.x - nx*half,
      y1: pt.y - ny*half,
      x2: pt.x + nx*half,
      y2: pt.y + ny*half,
      segmentIndex: targetSegment.index,
      key: `sleeper-${currentArcLength.toFixed(1)}`
    })
    
    currentArcLength += sleeperSpacing
  }
  
  return allSleepers
}

export default function RailMap({ stages = [], onStationClick, stationBaseSize = 44, stationOpenSize = 30, spacingFactor = 1.0, spacingMin = 1, spacingMax = 3, blur = false }){
  const containerRef = useRef(null)
  const [positions, setPositions] = useState([])
  const [trees, setTrees] = useState([])
  const [time, setTime] = useState(0)
  const [containerHeight, setContainerHeight] = useState(null)
  const [containerWidth, setContainerWidth] = useState(null)
  const [trackSegmentsData, setTrackSegmentsData] = useState([])

  // Track the completed stages
  const completedStages = stages.filter(s => s.status === 'completed')

  // Find the current active index that the train should target
  const activeIndex = stages.findIndex(s => s.status === 'unlocked')
  const targetTrainIndex = activeIndex !== -1 ? activeIndex : (stages.length > 0 && stages.every(s => s.status === 'completed') ? stages.length : 0)

  // Train animation state
  const [initialSet, setInitialSet] = useState(false)
  const [trainProgress, setTrainProgress] = useState(0)
  const trainProgressRef = useRef(0)

  useEffect(() => { trainProgressRef.current = trainProgress }, [trainProgress])

  // Set initial position once stages loaded
  useEffect(() => {
    if (stages.length > 0 && !initialSet) {
      setTrainProgress(targetTrainIndex)
      setInitialSet(true)
    }
  }, [stages, initialSet, targetTrainIndex])

  // Animate trainProgress smoothly when target index changes
  useEffect(() => {
    if (!initialSet || stages.length === 0) return

    let startTimestamp = null
    const duration = 2000 // 2 seconds travel time between stations
    const startVal = trainProgressRef.current
    const endVal = targetTrainIndex
    
    if (startVal === endVal) return

    let animationFrameId
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const elapsed = timestamp - startTimestamp
      const progressFraction = Math.min(elapsed / duration, 1)
      
      // Smooth cubic ease-in-out
      const ease = progressFraction < 0.5
        ? 4 * progressFraction * progressFraction * progressFraction
        : 1 - Math.pow(-2 * progressFraction + 2, 3) / 2
        
      const currentVal = startVal + (endVal - startVal) * ease
      setTrainProgress(currentVal)
      
      if (progressFraction < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setTrainProgress(endVal)
      }
    }
    
    animationFrameId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationFrameId)
  }, [targetTrainIndex, initialSet])

  // Quadratic bezier point computation: B(t) = (1-t)² P0 + 2(1-t)t P1 + t² P2
  function quadraticBezier(t, p0, p1, p2){
    const mt = 1 - t
    return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2
  }

  // River path sampling - used to detect if station is on river
  function isPointNearRiver(x, y, tolerance = 60, Woverride = null, Hoverride = null){
    const designW = 600
    const designH = 2100
    const Wlocal = Woverride || containerWidth || designW
    const Hlocal = Hoverride || containerHeight || designH

    const sx = Wlocal / designW
    const sy = Hlocal / designH

    const riverSegments = [
      { y0: -100 * sy, y1: 400 * sy, x0: -50 * sx, cx: 20 * sx, x1: 80 * sx, cy0: -100 * sy, cy: 100 * sy, cy1: 400 * sy },
      { y0: 400 * sy, y1: 900 * sy, x0: 80 * sx, cx: 120 * sx, x1: 60 * sx, cy0: 400 * sy, cy: 650 * sy, cy1: 900 * sy },
      { y0: 900 * sy, y1: 1400 * sy, x0: 60 * sx, cx: 10 * sx, x1: 100 * sx, cy0: 900 * sy, cy: 1100 * sy, cy1: 1400 * sy },
      { y0: 1400 * sy, y1: 1800 * sy, x0: 100 * sx, cx: 140 * sx, x1: 90 * sx, cy0: 1400 * sy, cy: 1600 * sy, cy1: 1800 * sy },
      { y0: 1800 * sy, y1: 2100 * sy, x0: 90 * sx, cx: 40 * sx, x1: 30 * sx, cy0: 1800 * sy, cy: 1950 * sy, cy1: 2100 * sy },
    ]

    const samples = 36
    const tol = tolerance * Math.max(sx, sy)
    for(const segment of riverSegments){
      for(let i=0;i<=samples;i++){
        const t = i / samples
        const px = quadraticBezier(t, segment.x0, segment.cx, segment.x1)
        const py = quadraticBezier(t, segment.cy0, segment.cy, segment.cy1)
        if(Math.hypot(px - x, py - y) < tol) return true
      }
    }
    return false
  }

  useEffect(()=>{
    function compute(){
      const el = containerRef.current
      if(!el) return
      const rect = el.getBoundingClientRect()
      const W = Math.max(300, rect.width)
      
      const stationSpacing = 140
      const totalPoints = stages.length + 1
      const H = Math.max(600, totalPoints * stationSpacing + 100)
      
      const pos = []
      const padding = 80
      const usableWidth = W - padding * 2
      const stationWidth = usableWidth
      const stationStart = padding
      
      for(let i = 0; i < totalPoints; i++){
        const isDepot = i === stages.length
        const s = isDepot ? { id: 'depot-end' } : stages[i]
        const seed = String(s.id || i)
        const h = hashNumber(seed + (i * 37))
        
        const r1 = (h % 1000) / 1000
        let left = stationStart + r1 * stationWidth
        left = Math.max(padding, Math.min(W - padding, left))
        
        const top = 60 + i * stationSpacing
        
        if(isPointNearRiver(left, top, 40, W, H)){
          left = padding + 30
        }
        
        left = Math.max(padding + 20, Math.min(W - padding - 20, left))
        pos.push({ left, top })
      }

      const treesList = []
      const minDistToStation = stationBaseSize * 1.1
      const minDistToTrack = 60
      const gridSpacing = 45

      function dist(a, b){ return Math.hypot(a.left - b.left, a.top - b.top) }

      const trackSegments = []
      for(let i=1;i<pos.length;i++){
        const p1 = pos[i-1]
        const p2 = pos[i]
        const dx = (p2.left - p1.left) * 0.15
        const cx1 = p1.left + dx
        const cy1 = p1.top + (p2.top - p1.top) * 0.33
        const cx2 = p2.left - dx
        const cy2 = p1.top + (p2.top - p1.top) * 0.67
        trackSegments.push({ x1: p1.left, y1: p1.top, cx1, cy1, cx2, cy2, x2: p2.left, y2: p2.top })
      }

      function isPointNearTracks(x,y,tol){
        const samples = 24
        for(const seg of trackSegments){
          for(let s=0;s<=samples;s++){
            const t = s / samples
            const mt = 1 - t
            const px = mt*mt*mt*seg.x1 + 3*mt*mt*t*seg.cx1 + 3*mt*t*t*seg.cx2 + t*t*t*seg.x2
            const py = mt*mt*mt*seg.y1 + 3*mt*mt*t*seg.cy1 + 3*mt*t*t*seg.cy2 + t*t*t*seg.y2
            const d = Math.hypot(px - x, py - y)
            if(d < tol) return true
          }
        }
        return false
      }

      // Grid-based tree generation to cover entire map
      const gridRows = Math.ceil(H / gridSpacing)
      const gridCols = Math.ceil(W / gridSpacing)
      
      for(let row = 0; row < gridRows; row++){
        for(let col = 0; col < gridCols; col++){
          const baseLeft = col * gridSpacing
          const baseTop = row * gridSpacing
          
          // Add slight random offset to each grid point for organic look
          const seed = 'tree-' + row + '-' + col
          const h = hashNumber(seed)
          const offsetX = ((h % 1000) / 1000 - 0.5) * gridSpacing * 0.6
          const offsetY = (((h >> 10) % 1000) / 1000 - 0.5) * gridSpacing * 0.6
          
          const left = baseLeft + offsetX
          const top = baseTop + offsetY
          
          // Skip if outside map bounds
          if(left < padding || left > W - padding || top < 40 || top > H - 40) continue
          
          // Skip if near river
          if(isPointNearRiver(left, top, 130, W, H)) continue
          
          // Skip if near tracks
          if(isPointNearTracks(left, top, minDistToTrack)) continue
          
          // Skip if near any station
          let nearStation = false
          for(const sPos of pos){ 
            if(dist({left, top}, sPos) < minDistToStation){ 
              nearStation = true
              break 
            } 
          }
          if(nearStation) continue
          
          // All checks passed, add tree
          const size = 10 + (h % 14)
          const type = h % 3
          treesList.push({ left, top, size, type, key: 't-' + row + '-' + col })
        }
      }

      setPositions(pos)
      setTrees(treesList)
      setContainerHeight(H)
      setContainerWidth(W)
    }
    compute()
    window.addEventListener('resize', compute)
    return ()=> window.removeEventListener('resize', compute)
  }, [stages])

  useEffect(()=>{
    let raf = null
    const loop = (t)=>{
      setTime(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return ()=> cancelAnimationFrame(raf)
  }, [])

  function makeOrganicPath(p1, p2, idx){
    const x1 = p1.left
    const y1 = p1.top
    const x2 = p2.left
    const y2 = p2.top

    const dx = (x2 - x1) * 0.15

    const cx1 = x1 + dx
    const cy1 = y1 + (y2 - y1) * 0.33
    const cx2 = x2 - dx
    const cy2 = y1 + (y2 - y1) * 0.67

    const d = `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`
    return { d, x1, y1, cx1, cy1, cx2, cy2, x2, y2 }
  }

  function pointOnCubic(t, p){
    const { x1, y1, cx1, cy1, cx2, cy2, x2, y2 } = p
    const mt = 1 - t
    const x = mt*mt*mt*x1 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x2
    const y = mt*mt*mt*y1 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y2
    return { x, y }
  }

  function tangentOnCubic(t, p){
    const { x1, y1, cx1, cy1, cx2, cy2, x2, y2 } = p
    const mt = 1 - t
    const dx = 3*mt*mt*(cx1 - x1) + 6*mt*t*(cx2 - cx1) + 3*t*t*(x2 - cx2)
    const dy = 3*mt*mt*(cy1 - y1) + 6*mt*t*(cy2 - cy1) + 3*t*t*(y2 - cy2)
    return { dx, dy }
  }

  function makeParallelPath(p, offset){
    const samples = 40
    const points = []
    for(let i = 0; i <= samples; i++){
      const t = i / samples
      const pt = pointOnCubic(t, p)
      const tan = tangentOnCubic(t, p)
      let nx = -tan.dy
      let ny = tan.dx
      const len = Math.hypot(nx, ny) || 1
      nx /= len
      ny /= len
      points.push({ x: pt.x + nx * offset, y: pt.y + ny * offset })
    }
    let pathStr = `M ${points[0].x} ${points[0].y}`
    for(let i = 1; i < points.length; i++){
      pathStr += ` L ${points[i].x} ${points[i].y}`
    }
    return pathStr
  }

  function getTrackPoint(progressVal) {
    if (positions.length === 0) return { x: 0, y: 0, angle: 0 }
    
    const maxIdx = positions.length - 1
    const clampedProgress = Math.max(0, Math.min(maxIdx, progressVal))
    
    const idx = Math.floor(clampedProgress)
    const t = clampedProgress - idx
    
    // Когда локомотив на станции (t ≈ 0), используем угол входящего пути
    // чтобы он не разворачивался преждевременно в сторону следующего сегмента
    if (t === 0 && idx > 0) {
      const stationPos = positions[idx]
      // Используем угол конца входящего пути (сегмент idx-1 -> idx)
      const p1 = positions[idx - 1]
      const p2 = positions[idx]
      const info = makeOrganicPath(p1, p2, idx)
      const tan = tangentOnCubic(1, info)
      const angle = Math.atan2(tan.dy, tan.dx) * 180 / Math.PI
      return { x: stationPos.left, y: stationPos.top, angle }
    }
    
    if (idx >= maxIdx) {
      const lastPos = positions[maxIdx]
      let angle = 0
      if (maxIdx > 0) {
        const p1 = positions[maxIdx - 1]
        const p2 = positions[maxIdx]
        const info = makeOrganicPath(p1, p2, maxIdx)
        const tan = tangentOnCubic(1, info)
        angle = Math.atan2(tan.dy, tan.dx) * 180 / Math.PI
      }
      return { x: lastPos.left, y: lastPos.top, angle }
    }
    
    const p1 = positions[idx]
    const p2 = positions[idx + 1]
    const info = makeOrganicPath(p1, p2, idx + 1)
    const pt = pointOnCubic(t, info)
    const tan = tangentOnCubic(t, info)
    const angle = Math.atan2(tan.dy, tan.dx) * 180 / Math.PI
    return { x: pt.x, y: pt.y, angle }
  }

  function getTrainCarriages(currentProgress, carriageCount) {
    const carriages = []
    let currProg = currentProgress
    
    let lastPt = getTrackPoint(currProg)
    
    for (let j = 0; j < carriageCount; j++) {
      // Расстояние между вагонами: первый вагон ближе к локомотиву, остальные теснее друг к другу
      // SVG вагона 58px шириной, добавляем небольшой промежуток для видимой сцепки
      const targetDist = j === 0 ? 58 : 54
      
      let bestProg = currProg
      let bestDistDiff = Infinity
      
      let low = currProg - 15
      let high = currProg
      
      for (let iteration = 0; iteration < 30; iteration++) {
        const mid = (low + high) / 2
        const pt = getTrackPoint(mid)
        const d = Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y)
        
        if (d < targetDist) {
          high = mid
        } else {
          low = mid
        }
      }
      
      let scanProg = low
      let foundProg = low
      
      for (let s = 0; s < 300; s++) {
        scanProg -= 0.003
        if (scanProg < -20) break
        
        const pt = getTrackPoint(scanProg)
        const d = Math.hypot(pt.x - lastPt.x, pt.y - lastPt.y)
        const diff = Math.abs(d - targetDist)
        
        if (diff < bestDistDiff) {
          bestDistDiff = diff
          foundProg = scanProg
          
          if (diff < 0.5) {
            break
          }
        }
        
        if (d >= targetDist && diff < 0.8) {
          break
        }
      }
      
      currProg = foundProg
      lastPt = getTrackPoint(currProg)
      carriages.push({
        x: lastPt.x,
        y: lastPt.y,
        angle: lastPt.angle,
        progress: currProg
      })
    }
    return carriages
  }

  return (
    <div className={`railmap ${blur ? 'blurred' : ''}`} ref={containerRef} style={{ 
      ['--station-base-size']: stationBaseSize + 'px', 
      ['--station-open-size']: stationOpenSize + 'px',
      height: containerHeight ? containerHeight + 'px' : '70vh'
    }}>
      <div className="rail" style={{height: '100%'}}>
        {/* SVG for organic connections */}
        <svg className="rail-svg" preserveAspectRatio="none" width="100%" height="100%">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0b1220" floodOpacity="0.08" />
            </filter>
          </defs>
          {/* Trees (render behind tracks) */}
          {trees.map(t => (
            <g key={t.key} transform={`translate(${t.left},${t.top})`} opacity={0.98}>
              <rect x={-t.size*0.12} y={t.size*0.6} width={t.size*0.24} height={t.size*0.6} rx={2} ry={2} fill="#6b3f1f" />
              <circle cx={0} cy={0} r={t.size} fill={t.type === 0 ? '#2f7a2f' : t.type === 1 ? '#3aa34a' : '#1f6f3a'} stroke="rgba(0,0,0,0.06)" strokeWidth={1} />
            </g>
          ))}
          {positions.map((p, i)=>{
            if(i === 0) return null
            const info = makeOrganicPath(positions[i-1], positions[i], i)
            
            // Вычисляем полную длину этого сегмента пути
            const pathLength = cubicBezierLength(info.x1, info.y1, info.cx1, info.cy1, info.cx2, info.cy2, info.x2, info.y2, 150)
            
            // Расстояние между шпалами (в пикселях) - фиксированное значение для равномерного распределения
            const sleeperSpacing = 25 // Можно настроить для нужного эффекта
            
            // Количество шпал на этом сегменте, вычисленное на основе длины
            const sleeperCount = Math.max(2, Math.floor(pathLength / sleeperSpacing))
            
            const sleepers = []
            const d = info.d
            
            // Вычисляем текущее смещение для начала этого сегмента (для непрерывности между сегментами)
            // Это обеспечивает идеальное совмещение шпал между сегментами
            const segmentStartOffset = (i - 1) * sleeperSpacing * 100 % sleeperSpacing
            
            // Размещаем шпалы на основе длины дуги для идеального равномерного распределения
            for(let k = 0; k < sleeperCount; k++){
              const targetArcLength = (k + 1) * (pathLength / (sleeperCount + 1))
              const t = getParamAtArcLength(targetArcLength, info.x1, info.y1, info.cx1, info.cy1, info.cx2, info.cy2, info.x2, info.y2, 200)
              
              const pt = pointOnCubic(t, info)
              const tan = tangentOnCubic(t, info)
              let nx = -tan.dy
              let ny = tan.dx
              const len = Math.hypot(nx, ny) || 1
              nx /= len; ny /= len
              const half = 10
              sleepers.push({ x1: pt.x - nx*half, y1: pt.y - ny*half, x2: pt.x + nx*half, y2: pt.y + ny*half, key: i + '-s-' + k })
            }

            const railOffset = 7
            const railPathLeft = makeParallelPath(info, -railOffset)
            const railPathRight = makeParallelPath(info, railOffset)

            return (
              <g key={i} filter="url(#shadow)">
                {/* track base */}
                <path className="constellation-track" d={d} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* left rail */}
                <path className="constellation-rail" d={railPathLeft} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* right rail */}
                <path className="constellation-rail" d={railPathRight} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                {/* sleepers connecting the two rails */}
                {sleepers.map(slp => (
                  <line key={slp.key} className="rail-sleeper" x1={slp.x1} y1={slp.y1} x2={slp.x2} y2={slp.y2} />
                ))}
              </g>
            )
          })}
        </svg>

        {/* Active train layer with smooth layout scaling on hover */}
        {positions.length > 0 && (() => {
          let trainOpacity = 1;
          if (stages.length > 0 && trainProgress > stages.length - 1) {
            const diff = stages.length - trainProgress;
            trainOpacity = Math.max(0, Math.min(1, diff));
          }
          return (
            <div className="train-layer" style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none',
              zIndex: 1,
              opacity: trainOpacity,
              transition: 'opacity 150ms linear'
            }}>
              {/* 1. Draw locomotive */}
              {(() => {
                const locoPt = getTrackPoint(trainProgress)
                return (
                  <motion.div
                    className="train-locomotive-container"
                    initial={{ x: locoPt.x, y: locoPt.y, rotate: locoPt.angle, scale: 1, opacity: 1 }}
                    animate={{ x: locoPt.x, y: locoPt.y, rotate: locoPt.angle, scale: 1, opacity: 1 }}
                    transition={{ duration: 0, type: 'linear' }}
                    whileHover={{ scale: 1.15, zIndex: 50 }}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '60px',
                      height: '28px',
                      transformOrigin: '50% 50%',
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="relative group" style={{ transform: 'translate(-50%, -50%)' }}>
                      <LocomotiveSVG />
                    </div>
                  </motion.div>
                )
              })()}

              {/* 2. Draw following wagons for each completed stage tightly coupled */}
              {(() => {
                const wagonsCount = completedStages.length
                const carriages = getTrainCarriages(trainProgress, wagonsCount)
                
                return completedStages.map((stage, j) => {
                  const wagonPt = carriages[j] || { x: 0, y: 0, angle: 0, progress: -1 }
                  const isClamped = wagonPt.progress < -0.15
                  
                  return (
                    <motion.div
                      key={stage.id || j}
                      className="train-wagon-container"
                      initial={{ x: wagonPt.x, y: wagonPt.y, rotate: wagonPt.angle, scale: isClamped ? 0 : 1, opacity: isClamped ? 0 : 1 }}
                      animate={{ x: wagonPt.x, y: wagonPt.y, rotate: wagonPt.angle, scale: isClamped ? 0 : 1, opacity: isClamped ? 0 : 1 }}
                      transition={{ duration: 0, type: 'linear' }}
                      whileHover={{ scale: 1.15, zIndex: 50 }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '58px',
                        height: '28px',
                        transformOrigin: '50% 50%',
                        pointerEvents: isClamped ? 'none' : 'auto',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="relative group" style={{ transform: 'translate(-50%, -50%)' }}>
                        <WagonSVG title={stage.title} />
                      </div>
                    </motion.div>
                  )
                })
              })()}
            </div>
          )
        })()}

        {/* Stations with vertical snake layout */}
        <div className="stations">
          {stages.map((s, idx) => {
            const pos = positions[idx] || { left: containerWidth ? containerWidth / 2 : 60, top: 60 + idx * 140 }
            
            let nodeStatus = 'locked'
            if(s.status === 'unlocked') nodeStatus = 'unlocked'
            else if(s.status === 'completed') nodeStatus = 'completed'
            
            return (
              <div key={s.id || idx}
                className={`station station-${nodeStatus}`}
                onClick={()=> onStationClick && onStationClick(s)}
                style={{ left: pos.left, top: pos.top, zIndex: stages.length - idx }}
              >
                <div className={`node node-${nodeStatus}`} aria-hidden>
                  <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style={{background: 'transparent'}}>
                    <rect x="0" y="0" width="64" height="64" fill="none" />
                    <path className="house-roof" d="M32 12 L10 30 H18 V50 H46 V30 H54 Z" />
                  </svg>
                </div>
                <div className="label">{s.title}</div>
              </div>
            )
          })}

          {/* Depot "Финиш" node */}
          {positions[stages.length] && (() => {
            const pos = positions[stages.length]
            const isCompleted = stages.length > 0 && stages.every(s => s.status === 'completed')
            
            return (
              <div 
                className={`station station-depot ${isCompleted ? 'active' : 'locked'}`}
                style={{ left: pos.left, top: pos.top, zIndex: 100 }}
              >
                <div className={`depot-node cursor-default select-none ${isCompleted ? 'active' : 'opacity-80'}`} style={{ width: '70px', height: '70px' }}>
                  <svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    {/* Depot building background */}
                    <rect x="10" y="32" width="60" height="38" rx="4" fill="#334155" />
                    {/* Archway entrance where the train goes */}
                    <path d="M 28 70 L 28 50 Q 28 44 34 42 Q 40 40 46 42 Q 52 44 52 50 L 52 70" fill="#1c2533" />
                    {/* Gate outline */}
                    <path d="M 28 70 L 28 50 Q 28 44 34 42 Q 40 40 46 42 Q 52 44 52 50 L 52 70" stroke={isCompleted ? "#E30613" : "#475569"} strokeWidth="1.5" fill="none" />
                    
                    {/* Red brick roof accent */}
                    <path d="M 6 32 L 40 15 L 74 32 Z" fill="#E30613" />
                    <path d="M 12 32 L 40 19 L 68 32 Z" fill="#b91c1c" />
                    
                    {/* Glowing Flag or sign saying ПОЛУФИНАЛ */}
                    <rect x="22" y="21" width="36" height="9" rx="1.5" fill={isCompleted ? "#E30613" : "#475569"} />
                    <text x="40" y="27.5" fill="#ffffff" fontSize="5.5" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">ПОЛУФИНАЛ</text>
                    
                    {/* Shiny Windows */}
                    <rect x="16" y="44" width="6" height="8" rx="1" fill={isCompleted ? "#38bdf8" : "#94a3b8"} opacity={isCompleted ? "0.9" : "0.5"} />
                    <rect x="58" y="44" width="6" height="8" rx="1" fill={isCompleted ? "#38bdf8" : "#94a3b8"} opacity={isCompleted ? "0.9" : "0.5"} />
                    
                    {/* Rails leading into the gate */}
                    <line x1="34" y1="70" x2="34" y2="60" stroke="#94a3b8" strokeWidth="1" />
                    <line x1="46" y1="70" x2="46" y2="60" stroke="#94a3b8" strokeWidth="1" />
                  </svg>
                </div>
                <div className="label font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-full text-[11px] backdrop-blur-xs mt-1.5 border border-slate-700">Полуфинал</div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}