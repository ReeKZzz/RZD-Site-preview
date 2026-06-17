import React from 'react'

export default function FinishModal({ onClose }){
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal finish-modal" role="dialog" aria-modal="true">
        <h2>🎉 Поздравляем! 🎉</h2>
        <p>
          Поздравляем с прохождением такого важного и длинного пути! За это время вы сблизились внутри своей семьи, научились работать в команде и узнали много нового!
        </p>
        <p className="finish-subtext">
          Совсем скоро придут результаты за дистанционный этап в личный кабинет, желаем вам успехов!
        </p>
        <div className="cta">
          <button className="primary" onClick={onClose}>Спасибо!</button>
        </div>
      </div>
    </div>
  )
}
