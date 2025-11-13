import React from 'react'

function B1({ label, onClick, color = 'blue' }) {
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-600 text-white px-4 py-2 rounded hover:bg-${color}-700`}
    >
      {label}
    </button>
  )
}

export default B1
