import type { CSSProperties } from 'react'

export type Element = {
  atomicNumber: number
  symbol: string
  name: string
  atomicMass: number
  group: number
  period: number
  category: string
  halfLife?: string
}

export type ElementDetailProps = {
  element: Element | null
}

export type ElementCellProps = {
  element: Element
  isSelected?: boolean
  isDimmed?: boolean
  onClick: (element: Element) => void
  onHover?: (element: Element | null, rect?: DOMRect) => void
  style?: CSSProperties
  className?: string
}

export type SearchBarProps = {
  search: string
  setSearch: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}
