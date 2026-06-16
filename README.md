# Roadmap Site (минимальный каркас)

Локальный SPA на React + Vite для пошагового прохождения roadmap. Прогресс хранится в `localStorage`.

Установка и запуск:

```bash
npm install
npm run dev
```

Файлы:
- `src/data/roadmap.json` — пример этапов
- `src/pages/Roadmap.jsx` — основная логика отображения и разблокировки этапов
- `src/components/StageCard.jsx` — карточка этапа
- `src/services/storage.js` — абстракция сохранения в `localStorage`

Дальше можно:
- добавить более сложную валидацию заданий
- добавить редактор этапов (Admin)
- подключить backend для синхронизации и авторизации
