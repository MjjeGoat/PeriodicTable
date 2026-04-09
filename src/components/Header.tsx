import SearchBar from './SearchBar'
import type { SearchBarProps } from '../data/types'

function Header({ search, setSearch }: SearchBarProps) {
  return (
    <header className="app-header">
      <div className="header-logo" aria-label="Interactive Periodic Table">
        <span>IPT</span>
      </div>

      <div className="header-search">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div className="header-actions" aria-label="Header actions">
        <button type="button" className="icon-button" aria-label="Toggle contrast">
          ◐
        </button>
        <button type="button" className="icon-button" aria-label="Open info">
          ⓘ
        </button>
      </div>
    </header>
  )
}

export default Header
