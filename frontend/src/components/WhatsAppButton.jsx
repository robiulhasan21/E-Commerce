import React from 'react'

const WhatsAppButton = ({ phone, message }) => {
  const phoneNumber = phone || import.meta.env.VITE_WHATSAPP_NUMBER || '+8801319290231'
  const encoded = encodeURIComponent(message || 'Hello, I need help with my order')
  const href = `https://wa.me/${phoneNumber.replace(/[^0-9+]/g, '')}?text=${encoded}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed left-6 bottom-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7">
        <path fill="currentColor" d="M20.52 3.48A11.95 11.95 0 0012 0C5.373 0 .001 5.373 0 12c0 2.11.55 4.095 1.59 5.88L0 24l6.29-1.64A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12 0-3.21-1.255-6.21-3.48-8.52zM12 22c-1.98 0-3.87-.52-5.54-1.5l-.4-.24-3.74.98.99-3.64-.26-.41A9.96 9.96 0 012 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.2-7.2c-.28-.14-1.66-.82-1.92-.92s-.42-.14-.6.14-.69.92-.85 1.12-.31.21-.59.07a8.2 8.2 0 01-2.42-1.5 9.06 9.06 0 01-1.69-2.1c-.17-.3 0-.46.12-.6.12-.12.28-.31.42-.46.14-.14.19-.24.28-.41.09-.17.05-.32-.03-.46-.08-.14-.6-1.44-.82-1.98-.22-.51-.44-.44-.6-.45-.15-.01-.33-.01-.51-.01s-.46.07-.7.32c-.24.24-.92.9-.92 2.2s.94 2.56 1.07 2.74c.14.17 1.86 2.84 4.5 3.87 2.64 1.02 2.64.68 3.11.63.46-.04 1.5-.61 1.71-1.2.21-.59.21-1.09.15-1.2-.06-.11-.22-.17-.5-.31z"/>
      </svg>
    </a>
  )
}

export default WhatsAppButton
