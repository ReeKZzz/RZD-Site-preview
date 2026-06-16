import React from 'react'

export default function TaskRunner({task, onDone}){
  return (
    <div className="task-runner">
      <p>{task}</p>
      <button onClick={onDone}>Пометить как выполненное</button>
    </div>
  )
}
