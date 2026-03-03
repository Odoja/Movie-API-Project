import mongoose from 'mongoose'

const genreSchema = new mongoose.Schema({
  _id: { type: String },
  name: {
    type: String,
    required: true,
    unique: true
  }
}, { strict: true })

export const Genre = mongoose.model('Genre', genreSchema)
