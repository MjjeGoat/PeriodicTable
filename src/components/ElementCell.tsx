import type { ElementCellProps } from '../data/types'

function ElementCell({ element, isSelected = false, onClick }: ElementCellProps) {
  return (
    <button
      className={`element-cell${isSelected ? ' is-selected' : ''}`}
      type="button"
      onClick={() => onClick(element)}
    >
      <span className="element-cell-number">{element.atomicNumber}</span>
      <span className="element-cell-symbol">{element.symbol}</span>
      <span className="element-cell-name">{element.name}</span>
    </button>
  )
}

export default ElementCell
