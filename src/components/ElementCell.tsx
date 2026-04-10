import type { ElementCellProps } from '../data/types'

function getCompactName(name: string) {
  return name.length > 9 ? `${name.slice(0, 8)}…` : name
}

function ElementCell({
  element,
  isSelected = false,
  isDimmed = false,
  onClick,
  onHover,
  style,
  className = '',
}: ElementCellProps) {
  return (
    <button
      className={`element-cell${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-dimmed' : ''}${className ? ` ${className}` : ''}`}
      type="button"
      onClick={() => onClick(element)}
      onMouseEnter={(event) => onHover?.(element, event.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => onHover?.(null)}
      onFocus={(event) => onHover?.(element, event.currentTarget.getBoundingClientRect())}
      onBlur={() => onHover?.(null)}
      style={style}
      disabled={isDimmed}
    >
      <span className="element-cell-number">{element.atomicNumber}</span>
      <span className="element-cell-symbol">{element.symbol}</span>
      <span className="element-cell-name" title={element.name}>
        {getCompactName(element.name)}
      </span>
    </button>
  )
}

export default ElementCell
