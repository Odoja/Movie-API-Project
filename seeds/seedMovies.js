import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import csv from 'csv-parser'
import { connectToDatabase } from '../src/config/mongoose.js'
import { Movie } from '../src/models/MovieModel.js'

// Get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, '../public/data/mymoviedb.csv')

async function seedDatabase() {
  try {
    // Connect to database
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB')

    // Clear existing movies
    await Movie.deleteMany({})
    console.log('Cleared existing movies')

    // Parse CSV and collect movies
    const movies = []

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        movies.push({
          releaseDate: row.Release_Date || '',
          title: row.Title || '',
          overview: row.Overview || '',
          popularity: parseFloat(row.Popularity) || 0,
          voteCount: parseInt(row.Vote_Count) || 0,
          voteAverage: parseFloat(row.Vote_Average) || 0,
          originalLanguage: row.Original_Language || '',
          genre: row.Genre || '',
          posterUrl: row.Poster_Url || ''
        })
      })
      .on('end', async () => {
        console.log(`Parsed ${movies.length} movies from CSV`)

        // Insert in batches of 100 for better performance
        const batchSize = 1000
        for (let i = 0; i < movies.length; i += batchSize) {
          const batch = movies.slice(i, i + batchSize)
          await Movie.insertMany(batch)
          console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} movies)`)
        }

        console.log(`✓ Successfully seeded ${movies.length} movies!`)
        process.exit(0)
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error.message)
        process.exit(1)
      })
  } catch (error) {
    console.error('Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()