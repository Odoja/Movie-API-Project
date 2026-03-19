import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'node:url'
import csv from 'csv-parser'
import { connectToDatabase } from '../src/config/mongoose.js'
import { Movie } from '../src/models/schemes/movieSchema.js'
import { Genre } from '../src/models/schemes/genreSchema.js'
import { Language } from '../src/models/schemes/languageSchema.js'
import { User } from '../src/models/schemes/userSchema.js'

// Get directory paths
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const csvPath = path.join(__dirname, '../public/data/mymoviedb.csv')

/**
 * Seeds the database with movies from the CSV file.
 *
 * - Connects to MongoDB using the connection string from environment variables.
 * - Creates an admin user if it doesn't exist for data ownership.
 * - Parses the CSV file and extracts movies, genres, and languages.
 * - Upserts genres and languages to avoid duplicates.
 */
async function seedDatabase () {
  try {
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB')

    // Create or get admin user
    let adminUser = await User.findOne({ username: 'admin' })

    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        password: 'AdminPassword123!',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User'
      })
      console.log('Created admin user for data ownership')
    } else {
      console.log('Using existing admin user')
    }

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
    let totalInserted = 0
    let totalSkipped = 0

    for (let i = 0; i < movies.length; i += batchSize) {
      const batch = movies.slice(i, i + batchSize)

      const movieDocs = batch.map(row => {
        const genreNames = row.Genre ? row.Genre.split(',').map(g => g.trim()) : []
        const genreIds = genreNames.map(name => genreMap.get(name)).filter(id => id)

        return {
          releaseDate: row.Release_Date || '',
          title: row.Title || '',
          overview: row.Overview || '',
          popularity: parseFloat(row.Popularity) || 0,
          voteCount: parseInt(row.Vote_Count) || 0,
          voteAverage: parseFloat(row.Vote_Average) || 0,
          genres: genreIds,
          language: row.Original_Language ? languageMap.get(row.Original_Language) : null,
          posterUrl: row.Poster_Url || '',
          owner: adminUser._id
        }
      })

      // Check which movies already exist to avoid duplicates
      const existingMovies = await Movie.find({
        $or: movieDocs.map(doc => ({
          title: doc.title,
          releaseDate: doc.releaseDate
        }))
      }, { title: 1, releaseDate: 1 })

      const existingSet = new Set(
        existingMovies.map(m => `${m.title}|${m.releaseDate}`)
      )

      // Filter out duplicates
      const newMovies = movieDocs.filter(doc =>
        !existingSet.has(`${doc.title}|${doc.releaseDate}`)
      )

      if (newMovies.length > 0) {
        await Movie.insertMany(newMovies)
        totalInserted += newMovies.length
        totalSkipped += batch.length - newMovies.length
        console.log(`Inserted batch ${Math.floor(i / batchSize) + 1} (${newMovies.length} new movies, ${batch.length - newMovies.length} skipped as duplicates)`)
      } else {
        totalSkipped += batch.length
        console.log(`Batch ${Math.floor(i / batchSize) + 1}: All ${batch.length} movies already exist, skipped`)
      }
    }

    console.log(`Successfully seeded database! ${totalInserted} new movies added, ${totalSkipped} duplicates skipped.`)
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error.message)
    process.exit(1)
  }
}

seedDatabase()
