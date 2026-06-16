import React from 'react'

export default function StageCard({stage, onComplete}){
  const {id, title, value, task, status} = stage

  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'

  return (
    <article className={`stage-card ${status}`}>
      <h2>{title}</h2>
      <p className="value"><strong>Ценность:</strong> {value}</p>
      <div className="task">
        <p><strong>Задание:</strong> {task}</p>
      </div>
      <div className="controls">
        {isCompleted ? (
          <button disabled>Выполнено ✓</button>
        ) : (
          <button disabled={isLocked} onClick={()=>onComplete(id)}>{isLocked? 'Заблокировано' : 'Выполнил задание'}</button>
        )}
      </div>
    </article>
  )
}
