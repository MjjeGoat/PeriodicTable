type CredentialsData = {
  heading: string
  description?: string
  items: Array<{
    label: string
    value: string
  }>
}

export const credentials: CredentialsData = {
  heading: 'Credentials',
  items: [
    { label: 'Project', value: 'Interactive Periodic Table' },
    { label: 'Author', value: 'Zdeněk Vacek & Matěj Hanzlík' },
    { label: 'Class', value: 'C3a' },
    { label: 'School year', value: '2025/2026' },
  ],
}
