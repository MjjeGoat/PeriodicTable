import { useMemo, useState } from 'react'
import Header from '../components/Header'
import SearchBar from '../components/SearchBar'
import PeriodicTable from '../components/PeriodicTable'
import ElementDetail from '../components/ElementDetail'
import { elements } from './elements'
import type { Element } from './types'
import '../App.css'

function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<Element | null>(elements[0] ?? null)

  const filteredElements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return elements.filter((element) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        element.name.toLowerCase().includes(normalizedSearch) ||
        element.symbol.toLowerCase().includes(normalizedSearch)

      const matchesCategory =
        selectedCategory === null || element.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

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
    { label: 'Halogens', value: 'halogen', tone: 'dark' as const },
  ]

  const handleCategorySelect = (category: string) => {
    setSelectedCategory((currentCategory) =>
      currentCategory === category ? null : category,
    )
  }

  return (
    <div className="app-shell">
      <div className="app-blob app-blob-left" aria-hidden="true" />
      <div className="app-blob app-blob-right" aria-hidden="true" />

      <Header search={search} setSearch={setSearch} />

      <main className="app-main">
        <section className="mobile-home-card">
          <div className="logo-badge" aria-hidden="true">
            <span>IPT</span>
          </div>

          <div className="mobile-search-wrap">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

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

        <section className="desktop-table-card">
          <PeriodicTable
            elements={filteredElements}
            selectedElement={selectedElement}
            onSelect={setSelectedElement}
            search={search}
            setSearch={setSearch}
          />
        </section>

        <aside className="detail-dock">
          <ElementDetail element={selectedElement} />
        </aside>
      </main>

      <footer className="app-footer">
        <div className="footer-band" />
      </footer>
    </div>
  )
}

export default App
