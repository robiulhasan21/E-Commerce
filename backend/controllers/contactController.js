import Contact from '../models/contactModel.js'

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and message are required' })
    }

    const contact = new Contact({ name, email, subject, message })
    await contact.save()

    // For now, just persist the report. Admin can review in DB or we can add email later.
    return res.status(201).json({ message: 'Report submitted successfully' })
  } catch (err) {
    console.error('createContact error:', err)
    return res.status(500).json({ error: 'Unable to submit report' })
  }
}
