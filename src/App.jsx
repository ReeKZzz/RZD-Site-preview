import React, { useEffect, useState } from 'react'
import Roadmap from './pages/Roadmap'
import StationDetail from './pages/StationDetail'
import storage from './services/storage'
import roadmapData from './data/roadmap.json'
import IntroModal from './components/IntroModal'

export default function App(){
  const [stages, setStages] = useState([])
  const [selectedStationId, setSelectedStationId] = useState(null)
  const [showIntro, setShowIntro] = useState(true)

  useEffect(()=>{
    const saved = storage.load()
    if(saved){
      const merged = roadmapData.map(s => ({...s, status: saved[s.id] ?? 'locked'}))
      if(merged.length > 0 && merged[0].status === 'locked'){
        // Гарантируем, что первая станция будет разблокирована
        merged[0] = {...merged[0], status: 'unlocked'}
        const map = {}
        merged.forEach(m => map[m.id] = m.status)
        storage.save(map)
      }
      setStages(merged)
    } else {
      const def = roadmapData.map((s, idx) => ({...s, status: idx===0? 'unlocked':'locked'}))
      setStages(def)
      const map = {}
      def.forEach(d => map[d.id]=d.status)
      storage.save(map)
    }
  },[])

  const handleComplete = (id)=>{
    setStages(prev => {
      const next = prev.map((s, idx) => {
        if(s.id === id) return {...s, status: 'completed'}
        return s
      })
      const idx = prev.findIndex(p => p.id === id)
      if(idx >=0 && idx+1 < next.length){
        if(next[idx+1].status === 'locked') next[idx+1].status = 'unlocked'
      }
      const map = {}
      next.forEach(n => map[n.id]=n.status)
      storage.save(map)
      return next
    })
  }

  const handleStationClick = (s)=>{
    if(s.status !== 'locked') setSelectedStationId(s.id)
  }

  const handleBack = ()=> setSelectedStationId(null)

  const selectedStage = stages.find(s => s.id === selectedStationId)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Roadmap</h1>
        <p>Пошаговый план с заданиями — пройдите этапы, чтобы двигаться дальше.</p>
      </header>
      <main>
        {selectedStage ? (
          <StationDetail stage={selectedStage} onComplete={(id)=>{ handleComplete(id); handleBack() }} onBack={handleBack} />
        ) : (
          <Roadmap stages={stages} onStationClick={handleStationClick} blur={showIntro} />
        )}
      </main>
      {showIntro && <IntroModal onClose={()=>setShowIntro(false)} />}
    </div>
  )
}
