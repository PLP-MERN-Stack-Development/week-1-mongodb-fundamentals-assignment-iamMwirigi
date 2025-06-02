// queries.js

// Task 2: Basic CRUD Operations

// 1. Find all books in a specific genre (e.g., Fiction)
db.books.find({ genre: "Fiction" }).pretty()

// 2. Find books published after a certain year (e.g., after 2000)
db.books.find({ published_year: { $gt: 2000 } }).pretty()

// 3. Find books by a specific author (e.g., "George Orwell")
db.books.find({ author: "George Orwell" }).pretty()

// 4. Update the price of a specific book (e.g., "1984" to 15.99)
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 15.99 } }
)

// 5. Delete a book by its title (e.g., "Animal Farm")
db.books.deleteOne({ title: "Animal Farm" })



// Task 3: Advanced Queries

// 1. Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } }).pretty()

// 2. Use projection to return only title, author, and price fields
db.books.find(
  { genre: "Fiction" }, 
  { title: 1, author: 1, price: 1, _id: 0 }
).pretty()

// 3. Sort books by price ascending
db.books.find().sort({ price: 1 }).pretty()

// 4. Sort books by price descending
db.books.find().sort({ price: -1 }).pretty()

// 5. Pagination: skip first 5 books, limit to 5 books (page 2 if 5 books per page)
db.books.find().skip(5).limit(5).pretty()





// Task 4: Aggregation Pipeline

// 1. Calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
])

// 2. Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } },
  { $limit: 1 }
])

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $subtract: [ "$published_year", { $mod: [ "$published_year", 10 ] } ] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])

// Task 5: Indexing
// Create an index on the 'author' field
db.books.createIndex({ author: 1 })

// Create an index on the 'genre' field
db.books.createIndex({ genre: 1 })

// Create a compound index on 'genre' and 'published_year' to speed up queries filtering by both
db.books.createIndex({ genre: 1, published_year: -1 })

// Create an index on 'title' for quick lookups by title
db.books.createIndex({ title: 1 })

// Create a text index on 'title' and 'author' for text search
db.books.createIndex({ title: "text", author: "text" })
