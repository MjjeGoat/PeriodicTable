import type { SearchBarProps } from '../data/types'

function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <form className="searchbar" role="search">
      <label className="searchbar-label" htmlFor="element-search">
        Search
      </label>
      <input
        id="element-search"
        className="searchbar-input"
        type="search"
        placeholder="Search by symbol or name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
    </form>
  )
}

export default SearchBar
