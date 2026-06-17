# Roadmap Site (минимальный каркас)

Локальный SPA на React + Vite для пошагового прохождения roadmap. Прогресс хранится в `localStorage`.

Установка и запуск:

```bash
npm install
npm run dev
```

Файлы:
- `src/data/roadmap.json` — пример этапов
- `src/pages/Roadmap.jsx` — основная логика отображения
- `src/pages/StationDetail.jsx` — страница деталей станции
- `src/services/storage.js` — работа с `localStorage`

Дальше можно:
- добавить более сложную валидацию заданий
- добавить редактор этапов (Admin)
- подключить backend для синхронизации и авторизации
