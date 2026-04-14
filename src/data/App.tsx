import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PeriodicTable from '../components/PeriodicTable'
import ElementDetail from '../components/ElementDetail'
import { elements } from './elements'
import type { Element } from './types'
import '../App.css'

function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedElement, setSelectedElement] = useState<Element | null>(null)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(0)

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

  const categories = [
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
  ]

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
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

  return (
    <div className="app-shell">
      <Header search={search} setSearch={setSearch} />

      <main className="app-main">
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
            {categories.map((category) => (
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
              categories={categories.map(({ label, value }) => ({ label, value }))}
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
          className="icon-button mobile-bottom-search__button"
          aria-label="Toggle contrast"
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
          aria-label="Open info"
        >
          ⓘ
        </button>
      </div>
    </div>
  )
}

export default App
