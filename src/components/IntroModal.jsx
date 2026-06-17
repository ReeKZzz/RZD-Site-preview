import React from 'react'

export default function IntroModal({ onClose }){
  return (
    <div className="intro-modal-overlay">
      <div className="intro-modal" role="dialog" aria-modal="true">
        <h2>Дорогие участники!</h2>
        <p>
          Вы прибыли на самую необычную Российскую Железную Дорогу! Каждый из вас - важная деталь, без которой наш поезд ценностей не сможет сдвинуться с места. Впереди вас ждут много заданий, но важно делать все сообща!
        </p>
        <div className="cta">
          <button className="secondary" onClick={onClose}>Отправляемся в путь!</button>
        </div>
      </div>
    </div>
  )
}
