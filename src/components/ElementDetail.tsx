import type { ElementDetailProps } from '../data/types'

function ElementDetail({ element }: ElementDetailProps) {
  if (!element) {
    return (
      <section className="element-detail element-detail-empty">
        <h2>Select an element</h2>
        <p>Tap or click an element tile to see its properties here.</p>
      </section>
    )
  }

  return (
    <section className="element-detail">
      <div className="element-detail-head">
        <div>
          <h2>{element.name}</h2>
          <p className="element-detail-category">{element.category}</p>
        </div>
        <span className="element-detail-chip">{element.symbol}</span>
      </div>

      <dl className="element-detail-list">
        <div>
          <dt>Atomic number</dt>
          <dd>{element.atomicNumber}</dd>
        </div>
        <div>
          <dt>Atomic mass</dt>
          <dd>{element.atomicMass}</dd>
        </div>
        <div>
          <dt>Group</dt>
          <dd>{element.group === 0 ? 'n/a' : element.group}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{element.period}</dd>
        </div>
        {element.halfLife ? (
          <div>
            <dt>Half-life</dt>
            <dd>{element.halfLife}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  )
}

export default ElementDetail
