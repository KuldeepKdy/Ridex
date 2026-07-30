import React from 'react'

interface propType {
  open: boolean;
  onClose: () => void;
}

function AuthModal({open,onClose}: propType) {
  return (
    <div>AuthModal</div>
  )
}

export default AuthModal