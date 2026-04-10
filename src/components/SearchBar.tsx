import { useId } from 'react'
import type { SearchBarProps } from '../data/types'

function SearchBar({ search, setSearch, onFocus, onBlur }: SearchBarProps) {
  const inputId = useId()

  return (
    <form className="searchbar" role="search">
      <input
        id={inputId}
        className="searchbar-input"
        type="search"
        placeholder="Search by symbol or name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </form>
  )
}

export default SearchBar
