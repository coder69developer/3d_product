const STORAGE_KEY = 'product_config_saved_labels'
const EMPTY_LABELS = []

let cachedRaw = null
let cachedLabels = EMPTY_LABELS
const listeners = new Set()

function parseLabels(raw) {
  if (!raw) return EMPTY_LABELS
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : EMPTY_LABELS
  } catch {
    return EMPTY_LABELS
  }
}

function readLabelsFromStorage() {
  if (typeof window === 'undefined') return EMPTY_LABELS
  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (raw === cachedRaw) return cachedLabels

  const parsed = parseLabels(raw)
  cachedRaw = raw
  cachedLabels = parsed
  return cachedLabels
}

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

export function subscribeSavedLabels(listener) {
  listeners.add(listener)

  const handleStorage = (event) => {
    if (event.key !== STORAGE_KEY) return
    cachedRaw = null
    listener()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorage)
  }

  return () => {
    listeners.delete(listener)
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorage)
    }
  }
}

export function getSavedLabelsSnapshot() {
  return readLabelsFromStorage()
}

export function getSavedLabelsServerSnapshot() {
  return EMPTY_LABELS
}

export function getSavedLabels() {
  return readLabelsFromStorage()
}

export function saveLabel(label) {
  if (typeof window === 'undefined') return EMPTY_LABELS
  const existing = readLabelsFromStorage()
  const updated = [label, ...existing.filter((item) => item.id !== label.id)]
  const raw = JSON.stringify(updated)
  window.localStorage.setItem(STORAGE_KEY, raw)
  cachedRaw = raw
  cachedLabels = updated
  notifyListeners()
  return updated
}

export function deleteLabel(labelId) {
  if (typeof window === 'undefined') return EMPTY_LABELS
  const updated = readLabelsFromStorage().filter((item) => item.id !== labelId)
  const raw = JSON.stringify(updated)
  window.localStorage.setItem(STORAGE_KEY, raw)
  cachedRaw = raw
  cachedLabels = updated
  notifyListeners()
  return updated
}
