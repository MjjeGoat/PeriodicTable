import SearchBar from './SearchBar'
import ElementCell from './ElementCell'
import type { Element, SearchBarProps } from '../data/types'

type PeriodicTableProps = SearchBarProps & {
  elements: Element[]
  selectedElement: Element | null
  onSelect: (element: Element) => void
}

function PeriodicTable({
  elements,
  selectedElement,
  onSelect,
  search,
  setSearch,
}: PeriodicTableProps) {
  return (
    <section className="periodic-table">
      <div className="table-search-inline">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      <div className="table-scroll">
        <div className="table-grid">
          {elements.map((element) => (
            <ElementCell
              key={element.atomicNumber}
              element={element}
              isSelected={selectedElement?.atomicNumber === element.atomicNumber}
              onClick={onSelect}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PeriodicTable
