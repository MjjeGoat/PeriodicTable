const STORAGE_KEYS = {
  search: 'periodic-table:search',
  selectedCategory: 'periodic-table:selected-category',
  selectedElementAtomicNumber: 'periodic-table:selected-element',
  theme: 'periodic-table:theme',
} as const

export type PersistedUiState = {
  search: string
  selectedCategory: string
  selectedElementAtomicNumber: number | null
  theme: 'light' | 'dark'
  hadRecovery: boolean
}

const DEFAULT_UI_STATE: PersistedUiState = {
  search: '',
  selectedCategory: 'all',
  selectedElementAtomicNumber: null,
  theme: 'light',
  hadRecovery: false,
}

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export function loadUiState(validCategories: Set<string>): PersistedUiState {
  if (!canUseLocalStorage()) {
    return DEFAULT_UI_STATE
  }

  let hadRecovery = false

  try {
    const rawSearch = window.localStorage.getItem(STORAGE_KEYS.search)
    const rawSelectedCategory = window.localStorage.getItem(STORAGE_KEYS.selectedCategory)
    const rawSelectedElement = window.localStorage.getItem(
      STORAGE_KEYS.selectedElementAtomicNumber,
    )
    const rawTheme = window.localStorage.getItem(STORAGE_KEYS.theme)

    const search = rawSearch === null ? '' : rawSearch

    if (typeof search !== 'string') {
      hadRecovery = true
    }

    const selectedCategory =
      rawSelectedCategory !== null && validCategories.has(rawSelectedCategory)
        ? rawSelectedCategory
        : 'all'

    if (rawSelectedCategory !== null && !validCategories.has(rawSelectedCategory)) {
      hadRecovery = true
    }

    const selectedElementAtomicNumber =
      rawSelectedElement !== null && Number.isInteger(Number(rawSelectedElement))
        ? Number(rawSelectedElement)
        : null

    if (
      rawSelectedElement !== null &&
      !Number.isInteger(Number(rawSelectedElement))
    ) {
      hadRecovery = true
    }

    const theme = rawTheme === 'dark' || rawTheme === 'light' ? rawTheme : 'light'

    if (rawTheme !== null && rawTheme !== 'dark' && rawTheme !== 'light') {
      hadRecovery = true
    }

    return {
      search,
      selectedCategory,
      selectedElementAtomicNumber,
      theme,
      hadRecovery,
    }
  } catch {
    return {
      ...DEFAULT_UI_STATE,
      hadRecovery: true,
    }
  }
}

export function saveUiState(state: Omit<PersistedUiState, 'hadRecovery'>) {
  if (!canUseLocalStorage()) {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.search, state.search)
    window.localStorage.setItem(STORAGE_KEYS.selectedCategory, state.selectedCategory)
    window.localStorage.setItem(STORAGE_KEYS.theme, state.theme)

    if (state.selectedElementAtomicNumber === null) {
      window.localStorage.removeItem(STORAGE_KEYS.selectedElementAtomicNumber)
      return
    }

    window.localStorage.setItem(
      STORAGE_KEYS.selectedElementAtomicNumber,
      String(state.selectedElementAtomicNumber),
    )
  } catch {
    // Ignore storage write errors to keep the UI functional.
  }
}
