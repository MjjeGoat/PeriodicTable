import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PeriodicTable from '../components/PeriodicTable'
import ElementDetail from '../components/ElementDetail'
import CredentialsModal from '../components/CredentialsModal'
import { elements as elementCatalog } from './elements'
import { loadUiState, saveUiState } from './storage'
import type { Element } from './types'
import '../App.css'

const CATEGORIES = [
  { label: 'Alkali metals', value: 'alkali metal', tone: 'default' as const },
  {
    label: 'Alkaline earth metals',
    value: 'alkaline earth metal',
    tone: 'default' as const,
  },
  {
    label: 'Transition metals',
    value: 'transition metal',
    tone: 'muted' as const,
  },
  {
    label: 'Post-transition metals',
    value: 'post-transition metal',
    tone: 'muted' as const,
  },
  { label: 'Lanthanides', value: 'lanthanide', tone: 'default' as const },
  { label: 'Actinides', value: 'actinide', tone: 'default' as const },
  { label: 'Metalloids', value: 'metalloid', tone: 'muted' as const },
  { label: 'Other nonmetals', value: 'nonmetal', tone: 'default' as const },
  { label: 'Halogens', value: 'halogen', tone: 'dark' as const },
  { label: 'Noble gases', value: 'noble gas', tone: 'dark' as const },
] as const

const VALID_CATEGORY_VALUES = new Set(['all', ...CATEGORIES.map(({ value }) => value)])

function isValidElement(value: Element) {
  return (
    Number.isInteger(value.atomicNumber) &&
    value.atomicNumber > 0 &&
    typeof value.symbol === 'string' &&
    value.symbol.length > 0 &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    Number.isFinite(value.atomicMass) &&
    Number.isInteger(value.group) &&
    Number.isInteger(value.period) &&
    typeof value.category === 'string' &&
    value.category.length > 0
  )
}

function App() {
  const [initialUiState] = useState(() => loadUiState(VALID_CATEGORY_VALUES))
  const [search, setSearch] = useState(initialUiState.search)
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialUiState.selectedCategory,
  )
  const [selectedElement, setSelectedElement] = useState<Element | null>(() => {
    if (initialUiState.selectedElementAtomicNumber === null) {
      return null
    }

    return (
      elementCatalog.find(
        (element) => element.atomicNumber === initialUiState.selectedElementAtomicNumber,
      ) ?? null
    )
  })
  const [didRecoverState] = useState(initialUiState.hadRecovery)
  const [theme, setTheme] = useState<'light' | 'dark'>(initialUiState.theme)
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  const { dataError, elements } = useMemo(() => {
    const hasInvalidElement = elementCatalog.some((element) => !isValidElement(element))

    if (hasInvalidElement) {
      return {
        dataError:
          'Element data could not be fully loaded. The app switched to a safe empty state.',
        elements: [] as Element[],
      }
    }

    return {
      dataError: null,
      elements: elementCatalog,
    }
  }, [])

  const filteredElements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    const hasSearch = normalizedSearch.length > 0

    return elements.filter((element) => {
      const matchesSearch =
        !hasSearch ||
        element.name.toLowerCase().includes(normalizedSearch) ||
        element.symbol.toLowerCase().includes(normalizedSearch)

      const matchesCategory =
        hasSearch ||
        selectedCategory === 'all' ||
        element.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  const matchedAtomicNumbers = useMemo(
    () => new Set(filteredElements.map((element) => element.atomicNumber)),
    [filteredElements],
  )

  const mobileElements =
    search.trim().length > 0 || selectedCategory !== 'all' ? filteredElements : []

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'))
  }

  useEffect(() => {
    if (filteredElements.length === 0) {
      setSelectedElement(null)
      return
    }

    if (
      selectedElement !== null &&
      !filteredElements.some(
        (element) => element.atomicNumber === selectedElement.atomicNumber,
      )
    ) {
      setSelectedElement(null)
    }
  }, [filteredElements, selectedElement])

  useEffect(() => {
    if (!isSearchFocused || typeof window === 'undefined' || !window.visualViewport) {
      setKeyboardOffset(0)
      return
    }

    const viewport = window.visualViewport

    const updateKeyboardOffset = () => {
      const nextOffset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      )
      setKeyboardOffset(nextOffset)
    }

    updateKeyboardOffset()
    viewport.addEventListener('resize', updateKeyboardOffset)
    viewport.addEventListener('scroll', updateKeyboardOffset)

    return () => {
      viewport.removeEventListener('resize', updateKeyboardOffset)
      viewport.removeEventListener('scroll', updateKeyboardOffset)
    }
  }, [isSearchFocused])

  useEffect(() => {
    saveUiState({
      search,
      selectedCategory,
      selectedElementAtomicNumber: selectedElement?.atomicNumber ?? null,
      theme,
    })
  }, [search, selectedCategory, selectedElement, theme])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const { documentElement, body } = document
    const previousHtmlOverflow = documentElement.style.overflow
    const previousBodyOverflow = body.style.overflow

    if (isCredentialsOpen) {
      documentElement.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
    }

    return () => {
      documentElement.style.overflow = previousHtmlOverflow
      body.style.overflow = previousBodyOverflow
    }
  }, [isCredentialsOpen])

  return (
    <div className="app-shell">
      <Header
        search={search}
        setSearch={setSearch}
        isDarkTheme={theme === 'dark'}
        onToggleTheme={toggleTheme}
        onOpenCredentials={() => setIsCredentialsOpen(true)}
      />

      <main className="app-main">
        {dataError ? (
          <section className="app-message app-message-error" aria-live="polite">
            {dataError}
          </section>
        ) : null}

        {didRecoverState && !dataError ? (
          <section className="app-message" aria-live="polite">
            Saved state contained invalid values and was safely reset.
          </section>
        ) : null}

        <section className="mobile-home-card" aria-label="Mobile hero">
          <div className="logo-placeholder" aria-label="Logo placeholder">
            <span>Logo</span>
          </div>

          <div className="mobile-home-copy">
            <h1>Periodic Table</h1>
            <p>Browse categories and tap any element to open its detail.</p>
          </div>
        </section>

        <section className="mobile-category-card">
          <nav className="mobile-actions" aria-label="Element categories">
            {CATEGORIES.map((category) => (
              <button
                key={category.value}
                className={[
                  'pill-action',
                  category.tone === 'muted' ? 'pill-action-muted' : '',
                  category.tone === 'dark' ? 'pill-action-dark' : '',
                  selectedCategory === category.value ? 'pill-action-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                type="button"
                onClick={() => handleCategorySelect(category.value)}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </section>

        <div className="desktop-content-layout">
          <section className="desktop-table-card">
            <PeriodicTable
              elements={elements}
              selectedElement={selectedElement}
              onSelect={setSelectedElement}
              onClearSelection={() => setSelectedElement(null)}
              layout="desktop"
              matchedAtomicNumbers={matchedAtomicNumbers}
              categories={CATEGORIES.map(({ label, value }) => ({ label, value }))}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </section>
        </div>

        <section className="mobile-table-card">
          <PeriodicTable
            elements={mobileElements}
            selectedElement={selectedElement}
            onSelect={setSelectedElement}
            onClearSelection={() => setSelectedElement(null)}
            layout="mobile"
          />
        </section>

        <section className="mobile-detail-card">
          <ElementDetail element={selectedElement} />
        </section>
      </main>

      <div
        className="mobile-bottom-search"
        style={{ bottom: `${keyboardOffset}px` }}
      >
        <button
          type="button"
          className={`icon-button mobile-bottom-search__button${
            theme === 'dark' ? ' is-active' : ''
          }`}
          aria-label="Toggle dark theme"
          onClick={toggleTheme}
        >
          ◐
        </button>

        <div className="mobile-bottom-search__field">
          <SearchBar
            search={search}
            setSearch={setSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
        </div>

        <button
          type="button"
          className="icon-button mobile-bottom-search__button"
          aria-label="Open credentials"
          onClick={() => setIsCredentialsOpen(true)}
        >
          ⓘ
        </button>
      </div>

      <CredentialsModal
        isOpen={isCredentialsOpen}
        onClose={() => setIsCredentialsOpen(false)}
      />
    </div>
  )
}

export default App
