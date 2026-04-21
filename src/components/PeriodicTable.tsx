import type { MouseEvent } from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import ElementCell from './ElementCell'
import ElementDetail from './ElementDetail'
import type { Element } from '../data/types'

type CategoryOption = {
  label: string
  value: string
}

type PeriodicTableProps = {
  elements: Element[]
  selectedElement: Element | null
  onSelect: (element: Element) => void
  onClearSelection?: () => void
  layout?: 'mobile' | 'desktop'
  matchedAtomicNumbers?: Set<number>
  categories?: CategoryOption[]
  selectedCategory?: string | null
  onCategorySelect?: (category: string) => void
}

function PeriodicTable({
  elements,
  selectedElement,
  onSelect,
  onClearSelection,
  layout = 'mobile',
  matchedAtomicNumbers,
  categories = [],
  selectedCategory = null,
  onCategorySelect,
}: PeriodicTableProps) {
  const isDesktopTable = layout === 'desktop'
  const tableRef = useRef<HTMLElement | null>(null)
  const hoverDetailRef = useRef<HTMLDivElement | null>(null)
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null)
  const [hoveredAnchorRect, setHoveredAnchorRect] = useState<DOMRect | null>(null)
  const [hoveredPosition, setHoveredPosition] = useState({
    left: 0,
    top: 0,
    maxHeight: 0,
  })
  const periodLabels = ['1', '2', '3', '4', '5', '6', '7', '', '6', '7']
  const matchedCategories = new Set(
    elements
      .filter((element) => {
        if (!isDesktopTable || matchedAtomicNumbers === undefined) {
          return true
        }

        return matchedAtomicNumbers.has(element.atomicNumber)
      })
      .map((element) => element.category),
  )

  useLayoutEffect(() => {
    if (
      !isDesktopTable ||
      hoveredElement === null ||
      hoveredAnchorRect === null ||
      hoverDetailRef.current === null
    ) {
      return
    }

    const visualViewport = window.visualViewport
    const viewportLeft = visualViewport?.offsetLeft ?? 0
    const viewportTop = visualViewport?.offsetTop ?? 0
    const viewportWidth = visualViewport?.width ?? window.innerWidth
    const viewportHeight = visualViewport?.height ?? window.innerHeight
    const viewportRight = viewportLeft + viewportWidth
    const viewportBottom = viewportTop + viewportHeight
    const gap = 12
    const viewportPadding = 12
    const overlayRect = hoverDetailRef.current.getBoundingClientRect()
    const overlayWidth = overlayRect.width
    const overlayHeight = overlayRect.height
    const availableHeight = Math.max(160, viewportHeight - viewportPadding * 2)
    const boundedOverlayHeight = Math.min(overlayHeight, availableHeight)

    const placeRight =
      hoveredAnchorRect.right + gap + overlayWidth <= viewportRight - viewportPadding

    const preferredLeft = placeRight
      ? hoveredAnchorRect.right + gap
      : hoveredAnchorRect.left - overlayWidth - gap

    const centeredTop =
      hoveredAnchorRect.top + hoveredAnchorRect.height / 2 - overlayHeight / 2
    const nextLeft = Math.min(
      Math.max(viewportLeft + viewportPadding, preferredLeft),
      viewportRight - overlayWidth - viewportPadding,
    )
    const nextTop = Math.min(
      Math.max(viewportTop + viewportPadding, centeredTop),
      viewportBottom - boundedOverlayHeight - viewportPadding,
    )

    setHoveredPosition((currentPosition) => {
      if (
        Math.abs(currentPosition.left - nextLeft) < 0.5 &&
        Math.abs(currentPosition.top - nextTop) < 0.5 &&
        Math.abs(currentPosition.maxHeight - availableHeight) < 0.5
      ) {
        return currentPosition
      }

      return { left: nextLeft, top: nextTop, maxHeight: availableHeight }
    })
  }, [isDesktopTable, hoveredAnchorRect, hoveredElement])

  const getDesktopPlacement = (element: Element) => {
    const isLanthanide = element.category === 'lanthanide'
    const isActinide = element.category === 'actinide'

    if (isLanthanide) {
      return {
        gridColumn: element.atomicNumber - 57 + 3,
        gridRow: 9,
      }
    }

    if (isActinide) {
      return {
        gridColumn: element.atomicNumber - 89 + 3,
        gridRow: 10,
      }
    }

    return {
      gridColumn: element.group,
      gridRow: element.period,
    }
  }

  const getCategoryClassName = (element: Element) => {
    switch (element.category) {
      case 'alkali metal':
        return 'element-cell-alkali'
      case 'alkaline earth metal':
        return 'element-cell-alkaline'
      case 'transition metal':
        return 'element-cell-transition'
      case 'post-transition metal':
        return 'element-cell-post-transition'
      case 'lanthanide':
        return 'element-cell-lanthanide'
      case 'actinide':
        return 'element-cell-actinide'
      case 'metalloid':
        return 'element-cell-metalloid'
      case 'nonmetal':
        return 'element-cell-nonmetal'
      case 'halogen':
        return 'element-cell-halogen'
      case 'noble gas':
        return 'element-cell-noble-gas'
      default:
        return ''
    }
  }

  const handleHover = (element: Element | null, rect?: DOMRect) => {
    if (!isDesktopTable || element === null || rect === undefined || tableRef.current === null) {
      setHoveredElement(null)
      setHoveredAnchorRect(null)
      return
    }

    setHoveredElement(element)
    setHoveredAnchorRect(rect)
  }

  const handleTableMouseDown = (event: MouseEvent<HTMLElement>) => {
    if (!isDesktopTable) {
      return
    }

    const target = event.target as HTMLElement
    const clickedInteractiveElement =
      target.closest('.element-cell') !== null ||
      target.closest('.table-category-chip') !== null ||
      target.closest('.table-hover-detail') !== null

    if (!clickedInteractiveElement) {
      onClearSelection?.()
    }
  }

  return (
    <section className="periodic-table" ref={tableRef} onMouseDown={handleTableMouseDown}>
      {isDesktopTable ? (
        <div className="table-toolbar">
          <div className="table-toolbar-title">Categories</div>
          <div className="table-category-filters">
            <button
              type="button"
              className={`table-category-chip${selectedCategory === 'all' ? ' is-active' : ''}`}
              onClick={() => onCategorySelect?.('all')}
            >
              All
            </button>
            {categories.map((category) => {
              const isUnavailable =
                isDesktopTable &&
                matchedAtomicNumbers !== undefined &&
                !matchedCategories.has(category.value)

              return (
                <button
                  key={category.value}
                  type="button"
                  className={`table-category-chip${
                    selectedCategory === category.value ? ' is-active' : ''
                  }${isUnavailable ? ' is-disabled' : ''}`}
                  onClick={() => onCategorySelect?.(category.value)}
                  disabled={isUnavailable}
                >
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}

      <div className={`table-shell${isDesktopTable ? ' table-shell-desktop' : ''}`}>
        {isDesktopTable ? (
          <>
            <div className="table-corner-label" aria-hidden="true">
              G/P
            </div>
            <div className="table-group-labels" aria-hidden="true">
              {Array.from({ length: 18 }, (_, index) => (
                <span key={index + 1}>{index + 1}</span>
              ))}
            </div>
            <div className="table-period-labels" aria-hidden="true">
              {periodLabels.map((label, index) => (
                <span key={`${label}-${index}`}>{label}</span>
              ))}
            </div>
          </>
        ) : null}

        <div className="table-scroll">
          {elements.length === 0 && !isDesktopTable ? (
            <div className="periodic-table-empty">
              <h3>No matching elements</h3>
              <p>Try another search term or switch back to the All category.</p>
            </div>
          ) : (
            <div className={`table-grid${isDesktopTable ? ' table-grid-desktop' : ''}`}>
              {elements.map((element) => (
                <ElementCell
                  key={element.atomicNumber}
                  element={element}
                  isSelected={selectedElement?.atomicNumber === element.atomicNumber}
                  isDimmed={
                    isDesktopTable &&
                    matchedAtomicNumbers !== undefined &&
                    !matchedAtomicNumbers.has(element.atomicNumber)
                  }
                  onClick={onSelect}
                  onHover={isDesktopTable ? handleHover : undefined}
                  style={isDesktopTable ? getDesktopPlacement(element) : undefined}
                  className={[
                    isDesktopTable ? 'element-cell-desktop' : '',
                    getCategoryClassName(element),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isDesktopTable && hoveredElement ? (
        <div
          ref={hoverDetailRef}
          className="table-hover-detail"
          style={{
            left: `${hoveredPosition.left}px`,
            top: `${hoveredPosition.top}px`,
            maxHeight: `${hoveredPosition.maxHeight}px`,
          }}
        >
          <ElementDetail element={hoveredElement} />
        </div>
      ) : null}
    </section>
  )
}

export default PeriodicTable
