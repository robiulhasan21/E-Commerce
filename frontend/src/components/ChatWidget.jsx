import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { assets } from '../assets/assets'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const ChatWidget = () => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text) return
    const userMsg = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${backendUrl}/api/chat`, { message: text })
      const reply = res?.data?.reply || 'Sorry, no reply.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      console.error('Chat error', err)
      const serverMsg = err?.response?.data?.detail || err?.response?.data?.error || err.message || 'Error contacting chat server.'
      setMessages(prev => [...prev, { role: 'assistant', content: String(serverMsg) }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="flex flex-col items-end">
        {open && (
          <div className="w-80 md:w-96 bg-gray-100 border rounded-lg shadow-lg flex flex-col overflow-hidden">
            <div className="px-4 py-4 bg-blue-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={assets.chat_img} alt="chat" className="w-8 h-8 object-contain" />
                <strong className="text-white">Chatbot</strong>
              </div>
              <button onClick={() => setOpen(false)} className="text-sm text-white">Close</button>
            </div>
            <div ref={listRef} className="h-64 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                m.role === 'assistant' ? (
                  <div key={i} className="flex items-start gap-2">
                    <img src={assets.chat_img} alt="assistant" className="w-7 h-9 object-contain"/>
                    <div className="text-sm p-2 rounded-md bg-gray-100">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="text-sm p-2 rounded-md bg-blue-50 self-end text-right">
                      {m.content}
                    </div>
                  </div>
                )
              ))}
              {loading && <div className="text-sm text-gray-500">Thinking...</div>}
            </div>
            <div className="p-3 border-r-4">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message..."
                className="w-full h-11 p-2 border rounded-md resize-none"
              />
              <div className="flex items-center justify-end mt-2">
                <button onClick={sendMessage} disabled={loading || !input.trim()} className="px-3 py-1 bg-blue-900 text-white rounded-md">Send</button>
              </div>
            </div>
          </div>
        )}

        <button onClick={() => setOpen(o => !o)} className="mt-3 w-14 h-14 flex items-center justify-center rounded-full  text-white shadow-lg">
          <img src={assets.chat_img} alt="chat" className="w-12 h-12 object-contain" />
        </button>
      </div>
    </div>
  )
}

export default ChatWidget
