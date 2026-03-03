# API Design Assignment

## Project Name

*Replace with the name of your API project.*

## Objective

Design and develop a robust, well-documented API (REST or GraphQL) that allows users to retrieve and manage information from a dataset of your choice. The API must include JWT authentication, automated testing via Postman/Newman in a CI/CD pipeline, and be publicly deployed.

Choose a dataset (10000+ data points) that interests you — it should include at least one primary CRUD resource and two additional read-only resources. Sources like [Kaggle](https://www.kaggle.com/datasets), public APIs, or CSV files work well. Pick something you find interesting, as you will reuse this API in the next assignment (WT dashboard).

*Describe your API in a few sentences: what dataset does it serve, what are its main resources, and what can users do with it?*

## Implementation Type

*Specify: REST or GraphQL*

## Links and Testing

| | URL / File |
|---|---|
| **Production API** | *...* |
| **API Documentation** | *...* |
| **GraphQL Playground** (GraphQL only) | *...* |
| **Postman Collection** | `*.postman_collection.json` |
| **Production Environment** | `production.postman_environment.json` |

**Examiner can verify tests in one of the following ways:**

1. **CI/CD pipeline** — check the pipeline output in GitLab for test results.
2. **Run manually** — no setup needed:
   ```
   npx newman run <collection.json> -e production.postman_environment.json
   ```

## Dataset

Dataset with +9000 movies

| Field | Description |
|---|---|
| **Dataset source** | [9000+ Movies Dataset – Kaggle](https://www.kaggle.com/datasets/disham993/9000-movies-dataset) |
| **Primary resource (CRUD)** | Movies (Title, Release_Date, Overview, Popularity, Vote_Count, Vote_Average, Poster_Url) |
| **Secondary resource 1 (read-only)** | Genre (ID, name) |
| **Secondary resource 2 (read-only)** | Language (ID, Code) |


## Design Decisions

### Authentication

*Describe your JWT authentication solution. Why did you choose this approach? What alternatives exist, and what are their trade-offs?*

### API Design

**REST students:**
- *How did you implement HATEOAS? How does it improve API discoverability?*
- *How did you structure your resource URLs and use HTTP methods/status codes?*

**GraphQL students:**
- *How did you design your schema (types, queries, mutations)?*
- *How did you implement nested queries? How does the single-endpoint approach affect your design?*

### Error Handling

*How does your API handle errors? Describe the format and consistency of your error responses.*

## Setup & Database Population

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Environment variables configured in `.env` file

### Environment Configuration

Create a `.env` file in the project root with the following variables:

```env
DB_CONNECTION_STRING=mongodb://localhost:27017/movies
```

### Running the Seed Script

To populate the database with the complete movie dataset (9827 movies from the CSV file), run:

```bash
npm run seed
```

**What the script does:**
- Connects to MongoDB using your `DB_CONNECTION_STRING`
- Reads `public/data/mymoviedb.csv` (9827 movies)
- Clears any existing movies in the database
- Inserts all movies in optimized batches of 1000
- Logs progress throughout the seeding process

**Expected output:**
```
Connected to MongoDB
Parsed 9827 movies from CSV
Cleared existing movies
Inserted batch 1 (1000 movies)
Inserted batch 2 (1000 movies)
...
✓ Successfully seeded 9827 movies!
```

## Core Technologies Used

*List the technologies you chose and briefly explain why:*


## Reflection

*What was hard? What did you learn? What would you do differently?*

## Acknowledgements

*Resources, attributions, or shoutouts.*

## Requirements

See [all requirements in Issues](../../issues/). Close issues as you implement them. Create additional issues for any custom functionality. See [TESTING.md](TESTING.md) for detailed testing requirements.

### Functional Requirements — Common

| Requirement | Issue | Status |
|---|---|---|
| Data acquisition — choose and document a dataset (1000+ data points) | [#1](../../issues/1) | ✅ |
| Full CRUD for primary resource, read-only for secondary resources | [#2](../../issues/2) | :white_large_square: |
| JWT authentication for write operations | [#3](../../issues/3) | :white_large_square: |
| Error handling (400, 401, 404 with consistent format) | [#4](../../issues/4) | :white_large_square: |
| Filtering and pagination for large result sets | [#17](../../issues/17) | :white_large_square: |

### Functional Requirements — REST

| Requirement | Issue | Status |
|---|---|---|
| RESTful endpoints with proper HTTP methods and status codes | [#12](../../issues/12) | :white_large_square: |
| HATEOAS (hypermedia links in responses) | [#13](../../issues/13) | :white_large_square: |

### Functional Requirements — GraphQL

| Requirement | Issue | Status |
|---|---|---|
| Queries and mutations via single `/graphql` endpoint | [#14](../../issues/14) | ❌ |
| At least one nested query | [#15](../../issues/15) | ❌ |
| GraphQL Playground available | [#16](../../issues/16) | ❌ |

### Non-Functional Requirements

| Requirement | Issue | Status |
|---|---|---|
| API documentation (Swagger/OpenAPI or Postman) | [#6](../../issues/6) | :white_large_square: |
| Automated Postman tests (20+ test cases, success + failure) | [#7](../../issues/7) | :white_large_square: |
| CI/CD pipeline running tests on every commit/MR | [#8](../../issues/8) | :white_large_square: |
| Seed script for sample data | [#5](../../issues/5) | ✅ |
| Code quality (consistent standard, modular, documented) | [#10](../../issues/10) | :white_large_square: |
| Deployed and publicly accessible | [#9](../../issues/9) | :white_large_square: |
| Peer review reflection submitted on merge request | [#11](../../issues/11) | :white_large_square: |


