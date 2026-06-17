const KEY = 'roadmap-progress-v1'

export default {
  load() {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      console.error('storage.load', e)
      return null
    }
  },
  save(map) {
    try {
      localStorage.setItem(KEY, JSON.stringify(map))
    } catch (e) {
      console.error('storage.save', e)
    }
  }
}
