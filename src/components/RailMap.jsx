import React, { useRef, useState, useEffect } from 'react'

function hashNumber(str){
  let h = 2166136261 >>> 0
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

export default function RailMap({ stages = [], onStationClick, stationBaseSize = 44, stationOpenSize = 30, spacingFactor = 1.0, spacingMin = 1, spacingMax = 3, blur = false }){
  const containerRef = useRef(null)
  const [positions, setPositions] = useState([])
  const [trees, setTrees] = useState([])
  const [time, setTime] = useState(0)
  const [containerHeight, setContainerHeight] = useState(null)
  const [containerWidth, setContainerWidth] = useState(null)

  // Quadratic bezier point computation: B(t) = (1-t)² P0 + 2(1-t)t P1 + t² P2
  function quadraticBezier(t, p0, p1, p2){
    const mt = 1 - t
    return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2
  }

  // River path sampling - used to detect if station is on river
  // Current SVG path: M -100 -100 Q 100 150 250 400 Q 380 650 200 900 Q 50 1100 350 1400 Q 500 1600 280 1800 Q 150 1950 100 2100
  function isPointOnRiver(x, y, tolerance = 60, Woverride = null, Hoverride = null){
    const designW = 600
    const designH = 2100
    const Wlocal = Woverride || containerWidth || designW
    const Hlocal = Hoverride || containerHeight || designH

    const sx = Wlocal / designW
    const sy = Hlocal / designH

    // River segments defined as quadratic beziers in design space
    const riverSegments = [
      // Q 100 150 250 400: from (-100,-100) to (250,400), control (100,150)
      { y0: -100 * sy, y1: 400 * sy, x0: -100 * sx, cx: 100 * sx, x1: 250 * sx, cy0: -100 * sy, cy: 150 * sy, cy1: 400 * sy },
      // Q 380 650 200 900: from (250,400) to (200,900), control (380,650)
      { y0: 400 * sy, y1: 900 * sy, x0: 250 * sx, cx: 380 * sx, x1: 200 * sx, cy0: 400 * sy, cy: 650 * sy, cy1: 900 * sy },
      // Q 50 1100 350 1400: from (200,900) to (350,1400), control (50,1100)
      { y0: 900 * sy, y1: 1400 * sy, x0: 200 * sx, cx: 50 * sx, x1: 350 * sx, cy0: 900 * sy, cy: 1100 * sy, cy1: 1400 * sy },
      // Q 500 1600 280 1800: from (350,1400) to (280,1800), control (500,1600)
      { y0: 1400 * sy, y1: 1800 * sy, x0: 350 * sx, cx: 500 * sx, x1: 280 * sx, cy0: 1400 * sy, cy: 1600 * sy, cy1: 1800 * sy },
      // Q 150 1950 100 2100: from (280,1800) to (100,2100), control (150,1950)
      { y0: 1800 * sy, y1: 2100 * sy, x0: 280 * sx, cx: 150 * sx, x1: 100 * sx, cy0: 1800 * sy, cy: 1950 * sy, cy1: 2100 * sy },
    ]

    const tolX = tolerance * Math.max(sx, sy)
    for(let segment of riverSegments){
      if(y >= segment.y0 && y <= segment.y1){
        const t = (y - segment.y0) / (segment.y1 - segment.y0)
        const riverX = quadraticBezier(t, segment.x0, segment.cx, segment.x1)
        const riverY = quadraticBezier(t, segment.cy0, segment.cy, segment.cy1)
        if(Math.abs(x - riverX) < tolX && Math.abs(y - riverY) < tolX){
          return true
        }
      }
    }
    return false
  }

  // More robust river proximity test by sampling the river curve
  function isPointNearRiver(x, y, tolerance = 60, Woverride = null, Hoverride = null){
    const designW = 600
    const designH = 2100
    const Wlocal = Woverride || containerWidth || designW
    const Hlocal = Hoverride || containerHeight || designH

    const sx = Wlocal / designW
    const sy = Hlocal / designH

    const riverSegments = [
      { y0: -100 * sy, y1: 400 * sy, x0: -100 * sx, cx: 100 * sx, x1: 250 * sx, cy0: -100 * sy, cy: 150 * sy, cy1: 400 * sy },
      { y0: 400 * sy, y1: 900 * sy, x0: 250 * sx, cx: 380 * sx, x1: 200 * sx, cy0: 400 * sy, cy: 650 * sy, cy1: 900 * sy },
      { y0: 900 * sy, y1: 1400 * sy, x0: 200 * sx, cx: 50 * sx, x1: 350 * sx, cy0: 900 * sy, cy: 1100 * sy, cy1: 1400 * sy },
      { y0: 1400 * sy, y1: 1800 * sy, x0: 350 * sx, cx: 500 * sx, x1: 280 * sx, cy0: 1400 * sy, cy: 1600 * sy, cy1: 1800 * sy },
      { y0: 1800 * sy, y1: 2100 * sy, x0: 280 * sx, cx: 150 * sx, x1: 100 * sx, cy0: 1800 * sy, cy: 1950 * sy, cy1: 2100 * sy },
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
      
      // Calculate height based on number of stages with spacing
      const stationSpacing = 140
      const H = Math.max(600, stages.length * stationSpacing + 100)
      
      const pos = []
      const padding = 80
      const usableWidth = W - padding * 2
      // Use full width for station distribution
      const stationWidth = usableWidth
      const stationStart = padding
      
      for(let i = 0; i < stages.length; i++){
        const s = stages[i]
        const seed = String(s.id || i)
        // Use deterministic hash for consistent positioning
        const h = hashNumber(seed + (i * 37))
        
        // Generate random x value across full width
        const r1 = (h % 1000) / 1000
        let left = stationStart + r1 * stationWidth
        left = Math.max(padding, Math.min(W - padding, left))
        
        // Vertical position - progresses from top to bottom
        const top = 60 + i * stationSpacing
        
        // Check if station is on river, if so move it away (use local W/H)
        if(isPointNearRiver(left, top, 70, W, H)){
          // Move station to the left side safely
          left = padding + 30
        }
        
        // Final bounds check
        left = Math.max(padding + 20, Math.min(W - padding - 20, left))
        pos.push({ left, top })
      }

      // generate trees deterministically but avoid stations, river and tracks
      const treesList = []
      const treeCount = Math.max(20, Math.floor(H / 140) * 6)
      const minDistToStation = stationBaseSize * 1.1
      const minDistToTrack = 52
      const minDistToTree = 28

      function dist(a, b){ return Math.hypot(a.left - b.left, a.top - b.top) }

      // build bezier segments for tracks so we can check proximity
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
        // sample each cubic and see if point is close to any sample
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

      let attempts = 0
      for(let k = 0; k < treeCount && attempts < treeCount * 10; attempts++){
        const seed = 'tree-' + k + '-' + (attempts)
        const h = hashNumber(seed + (k * 97))
        const rx = (h % 1000) / 1000
        const ry = ((h >> 10) % 1000) / 1000

        const left = padding + rx * usableWidth
        const top = 40 + ry * (H - 80)

        const candidate = { left, top }

        if(isPointNearRiver(left, top, 85, W, H)) continue
        if(isPointNearTracks(left, top, minDistToTrack)) continue

        // avoid stations
        let nearStation = false
        for(const sPos of pos){ if(dist(candidate, sPos) < minDistToStation){ nearStation = true; break } }
        if(nearStation) continue

        // avoid other trees
        let nearTree = false
        for(const t of treesList){ if(dist(candidate, t) < minDistToTree){ nearTree = true; break } }
        if(nearTree) continue

        // size/type variety
        const size = 10 + (h % 14)
        const type = h % 3
        treesList.push({ left, top, size, type, key: 't-' + k + '-' + attempts })
        k++
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

  // animation loop
  useEffect(()=>{
    let raf = null
    const loop = (t)=>{
      setTime(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return ()=> cancelAnimationFrame(raf)
  }, [])

  // Create flowing connections with z-index stacking to avoid overlap
  function makeOrganicPath(p1, p2, idx){
    const x1 = p1.left
    const y1 = p1.top
    const x2 = p2.left
    const y2 = p2.top

    // Simple vertical connection with slight wave
    const dx = (x2 - x1) * 0.15

    // Create control points for smooth curve
    const cx1 = x1 + dx
    const cy1 = y1 + (y2 - y1) * 0.33
    const cx2 = x2 - dx
    const cy2 = y1 + (y2 - y1) * 0.67

    const d = `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`
    return { d, x1, y1, cx1, cy1, cx2, cy2, x2, y2 }
  }

  // Sample a point on cubic bezier
  function pointOnCubic(t, p){
    const { x1, y1, cx1, cy1, cx2, cy2, x2, y2 } = p
    const mt = 1 - t
    const x = mt*mt*mt*x1 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x2
    const y = mt*mt*mt*y1 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y2
    return { x, y }
  }

  // Derivative of cubic bezier at t
  function tangentOnCubic(t, p){
    const { x1, y1, cx1, cy1, cx2, cy2, x2, y2 } = p
    const mt = 1 - t
    const dx = 3*mt*mt*(cx1 - x1) + 6*mt*t*(cx2 - cx1) + 3*t*t*(x2 - cx2)
    const dy = 3*mt*mt*(cy1 - y1) + 6*mt*t*(cy2 - cy1) + 3*t*t*(y2 - cy2)
    return { dx, dy }
  }

  // Generate parallel bezier path offset perpendicular to the main path
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
    // Build path string
    let pathStr = `M ${points[0].x} ${points[0].y}`
    for(let i = 1; i < points.length; i++){
      pathStr += ` L ${points[i].x} ${points[i].y}`
    }
    return pathStr
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

            // compute sleepers positions
            const sleepers = []
            const samples = 8
            const d = info.d
            
            for(let k = 1; k <= samples; k++){
              const t = k / (samples + 1)
              const pt = pointOnCubic(t, info)
              const tan = tangentOnCubic(t, info)
              // perpendicular
              let nx = -tan.dy
              let ny = tan.dx
              const len = Math.hypot(nx, ny) || 1
              nx /= len; ny /= len
              const half = 10
              sleepers.push({ x1: pt.x - nx*half, y1: pt.y - ny*half, x2: pt.x + nx*half, y2: pt.y + ny*half, key: i + '-s-' + k })
            }

            // Generate two parallel rail paths
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

        {/* Stations with vertical snake layout */}
        <div className="stations">
          {stages.map((s, idx) => {
            const pos = positions[idx] || { left: containerWidth ? containerWidth / 2 : 60, top: 60 + idx * 140 }
            
            // Determine node color based on status
            let nodeStatus = 'locked' // default
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
        </div>
      </div>
    </div>
  )
}
