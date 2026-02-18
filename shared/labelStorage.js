const STORAGE_KEY = 'product_config_saved_labels'

export function getSavedLabels() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLabel(label) {
  if (typeof window === 'undefined') return []
  const existing = getSavedLabels()
  const updated = [label, ...existing.filter((item) => item.id !== label.id)]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function deleteLabel(labelId) {
  if (typeof window === 'undefined') return []
  const updated = getSavedLabels().filter((item) => item.id !== labelId)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}
