import React from 'react'
import RailMap from '../components/RailMap'

export default function Roadmap({stages = [], onStationClick, blur = false}){
  // Подбираемые значения: можно менять тут или в вызове App
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
