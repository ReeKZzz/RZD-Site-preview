import React from 'react'
import RailMap from '../components/RailMapNew'

export default function Roadmap({stages = [], onStationClick, blur = false}){
  if(!stages || stages.length === 0) {
    return (
      <section className="roadmap" style={{minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', color: '#64748b'}}>Загрузка маршрута...</div>
      </section>
    )
  }
  
  return (
    <section className="roadmap">
      <RailMap
        stages={stages}
        onStationClick={onStationClick}
        stationBaseSize={36}
        stationOpenSize={60}
        spacingFactor={1.15}
        blur={blur}
      />
    </section>
  )
}
