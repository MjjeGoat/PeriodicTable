import { credentials } from '../data/credentials'

type CredentialsModalProps = {
  isOpen: boolean
  onClose: () => void
}

function CredentialsModal({ isOpen, onClose }: CredentialsModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section
        className="credentials-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="credentials-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="credentials-modal__header">
          <div>
            <h2 id="credentials-title">{credentials.heading}</h2>
            <p>{credentials.description}</p>
          </div>

          <button
            type="button"
            className="icon-button credentials-modal__close"
            aria-label="Close credentials"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <dl className="credentials-modal__list">
          {credentials.items.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export default CredentialsModal
