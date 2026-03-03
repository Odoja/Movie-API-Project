import mongoose from 'mongoose'

const languageSchema = new mongoose.Schema({
  _id: { type: String },
  code: {
    type: String,
    required: true
  }
}, { strict: true })

export const Language = mongoose.model('Language', languageSchema)
