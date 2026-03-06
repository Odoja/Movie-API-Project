import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import csv from 'csv-parser'
import { connectToDatabase } from '../src/config/mongoose.js'
import { Movie } from '../src/models/schemes/movieSchema.js'
import { Genre } from '../src/models/schemes/genreSchema.js'
import { Language } from '../src/models/schemes/languageSchema.js'

// Get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, '../public/data/mymoviedb.csv')

async function seedDatabase() {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB')

    // Parse CSV
    const movies = []
    const genresSet = new Set()
    const languagesSet = new Set()

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          movies.push(row)
          if (row.Genre) {
            row.Genre.split(',').forEach(g => genresSet.add(g.trim()))
          }
          if (row.Original_Language) {
            languagesSet.add(row.Original_Language)
          }
        })
        .on('end', resolve)
        .on('error', reject)
    })

    console.log(`Parsed ${movies.length} movies from CSV`)

    // Upsert genres
    const genresToUpsert = Array.from(genresSet).map(name => ({ name }))
    for (const genre of genresToUpsert) {
      await Genre.updateOne({ name: genre.name }, { $set: genre }, { upsert: true })
    }
    console.log(`Upserted ${genresToUpsert.length} genres`)

    // Upsert languages
    const languagesToUpsert = Array.from(languagesSet).map(code => ({ code }))
    for (const language of languagesToUpsert) {
      await Language.updateOne({ code: language.code }, { $set: language }, { upsert: true })
    }
    console.log(`Upserted ${languagesToUpsert.length} languages`)

    // Get all genres and languages for mapping
    const allGenres = await Genre.find({})
    const genreMap = new Map(allGenres.map(g => [g.name, g._id]))

    const allLanguages = await Language.find({})
    const languageMap = new Map(allLanguages.map(l => [l.code, l._id]))

    // Transform and insert movies in batches
    const batchSize = 1000
    for (let i = 0; i < movies.length; i += batchSize) {
      const batch = movies.slice(i, i + batchSize)

      const movieDocs = batch.map(row => {
        const firstGenre = row.Genre ? row.Genre.split(',')[0].trim() : null
        return {
          releaseDate: row.Release_Date || '',
          title: row.Title || '',
          overview: row.Overview || '',
          popularity: parseFloat(row.Popularity) || 0,
          voteCount: parseInt(row.Vote_Count) || 0,
          voteAverage: parseFloat(row.Vote_Average) || 0,
          genre: firstGenre ? genreMap.get(firstGenre) : null,
          language: row.Original_Language ? languageMap.get(row.Original_Language) : null,
          posterUrl: row.Poster_Url || ''
        }
      })

      await Movie.insertMany(movieDocs)
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} movies)`)
    }

    console.log(`✓ Successfully seeded ${movies.length} movies!`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()