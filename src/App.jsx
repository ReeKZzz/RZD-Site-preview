import React, { useEffect, useState } from 'react'
import Roadmap from './pages/Roadmap'
import StationDetail from './pages/StationDetail'
import storage from './services/storage'
import roadmapData from './data/roadmap.json'
import IntroModal from './components/IntroModal'
import FinishModal from './components/FinishModal'

export default function App(){
  const [stages, setStages] = useState([])
  const [selectedStationId, setSelectedStationId] = useState(null)
  const [showIntro, setShowIntro] = useState(true)
  const [showFinish, setShowFinish] = useState(false)
  const [hasSeenFinish, setHasSeenFinish] = useState(false)

  useEffect(()=>{
    try {
      const saved = storage.load()
      const stagesData = saved 
        ? roadmapData.map(s => ({...s, status: saved[s.id] ?? 'locked'}))
        : roadmapData.map((s, i) => ({...s, status: i === 0 ? 'unlocked' : 'locked'}))
      
      if(stagesData.length > 0 && stagesData[0].status === 'locked') {
        stagesData[0].status = 'unlocked'
      }
      
      storage.save(Object.fromEntries(stagesData.map(s => [s.id, s.status])))
      setStages(stagesData)
    } catch(e) {
      console.error('Failed to load stages:', e)
      const fallback = roadmapData.map((s, i) => ({...s, status: i === 0 ? 'unlocked' : 'locked'}))
      setStages(fallback)
    }
  },[])

  const handleComplete = (id)=>{
    setStages(prev => {
      const idx = prev.findIndex(p => p.id === id)
      if(idx < 0) return prev
      
      const next = prev.map((s, i) => {
        if(i === idx) return {...s, status: 'completed'}
        if(i === idx + 1 && s.status === 'locked') return {...s, status: 'unlocked'}
        return s
      })
      
      storage.save(Object.fromEntries(next.map(n => [n.id, n.status])))
      return next
    })
  }

  const handleResetProgress = ()=>{
    if(confirm('Вы уверены, что хотите сбросить весь прогресс?')){
      const def = roadmapData.map((s, i) => ({...s, status: i === 0 ? 'unlocked' : 'locked'}))
      storage.save(Object.fromEntries(def.map(d => [d.id, d.status])))
      setStages(def)
      setShowFinish(false)
      setHasSeenFinish(false)
    }
  }

  const isAllCompleted = stages.length > 0 && stages.every(s => s.status === 'completed')

  // Show finish modal when all stages are completed (only once)
  useEffect(() => {
    if (isAllCompleted && !hasSeenFinish) {
      setShowFinish(true)
      setHasSeenFinish(true)
    }
  }, [isAllCompleted, hasSeenFinish])

  const selectedStage = stages.find(s => s.id === selectedStationId)

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-top">
          <div>
            <h1>Локомотив семейных ценностей</h1>
            <p>Пошаговый план с заданиями - пройдите этапы, чтобы двигаться дальше.</p>
          </div>
          <button className="reset-btn" onClick={handleResetProgress} title="Сбросить прогресс">↻</button>
        </div>
      </header>
      <main>
        <Roadmap 
          stages={stages} 
          onStationClick={(s) => s.status !== 'locked' && setSelectedStationId(s.id)} 
          blur={showIntro || !!selectedStage || showFinish} 
        />

        {selectedStage && (
          <div className="station-modal-overlay" onClick={()=> setSelectedStationId(null)}>
            <div className="station-modal" onClick={(e)=> e.stopPropagation()}>
              <StationDetail 
                stage={selectedStage} 
                onComplete={(id)=>{ handleComplete(id); setSelectedStationId(null) }} 
                onBack={()=> setSelectedStationId(null)} 
              />
            </div>
          </div>
        )}
      </main>
      {showIntro && <IntroModal onClose={()=>setShowIntro(false)} />}
      {showFinish && <FinishModal onClose={()=>setShowFinish(false)} />}
    </div>
  )
}
