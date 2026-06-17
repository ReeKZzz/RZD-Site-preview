import React from 'react'

export default function StationDetail({stage, onComplete, onBack}){
  if(!stage) return null

  const {id, title, value, task, status} = stage
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'

  return (
    <section className="station-detail">
      <button className="back" onClick={onBack}>← Назад</button>
      <h2>Станция: «{title}»</h2>
      <p className="value"><strong>Задание:</strong> {value}</p>
      <div className="task">
        <p><strong>Требования:</strong></p>
        <p>{task}</p>
      </div>
      <div className="controls">
        {isCompleted ? (
          <button disabled>Выполнено ✓</button>
        ) : (
          <button disabled={isLocked} onClick={()=> onComplete(id)}>{isLocked? 'Заблокировано' : 'Выполнить'}</button>
        )}
      </div>
    </section>
  )
}
