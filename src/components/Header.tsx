import SearchBar from './SearchBar'
import type { SearchBarProps } from '../data/types'

type HeaderProps = SearchBarProps & {
  isDarkTheme: boolean
  onToggleTheme: () => void
  onOpenCredentials: () => void
}

function Header({
  search,
  setSearch,
  isDarkTheme,
  onToggleTheme,
  onOpenCredentials,
}: HeaderProps) {
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`

  return (
    <header className="app-header">
      <div className="header-logo" aria-label="Periodic Table logo">
        <img src={logoSrc} alt="Periodic Table" className="header-logo__image" />
      </div>

      <div className="header-search">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div className="header-actions" aria-label="Header actions">
        <button
          type="button"
          className={`icon-button${isDarkTheme ? ' is-active' : ''}`}
          aria-label="Toggle dark theme"
          onClick={onToggleTheme}
        >
          ◐
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Open credentials"
          onClick={onOpenCredentials}
        >
          ⓘ
        </button>
      </div>
    </header>
  )
}

export default Header
