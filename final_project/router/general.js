const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    // If either username or password is missing, return a 400 (Bad Request) response
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (userExists(username)) {
    // If the username already exists, return a 409 (Conflict) response
    return res.status(409).json({ message: "Username already exists" });
  }

  // If all validation checks pass, you can proceed with user registration
  // For simplicity, let's assume user registration involves adding the user to a database
  
  // Return a 201 (Created) response indicating successful registration
  return res.status(201).json({ message: "User registered successfully" });
});


// Function to check if the username already exists (dummy function for demonstration)
function userExists(username) {
  // Dummy logic to check if the username exists 
  // For demonstration, assume there's an array of existing usernames
  const existingUsernames = ["user1", "user2", "user3"];
  return existingUsernames.includes(username);
}


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4));
});


// Task 10
public_users.get('/', async function (req, res) {
  try {
    const booksJSON = await sendBooksResponse();
    res.send(booksJSON);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

async function sendBooksResponse() {
  return JSON.stringify(books, null, 4);
}
// End of Task 10


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented ISBN"});
  const isbn = req.params.isbn;
  res.send(books[isbn])
 });

 // Task 11
 public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const bookDetails = await getBookDetails(isbn);
    res.send(bookDetails);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

async function getBookDetails(isbn) {
  return books[isbn];
}
// End of Task 11

 
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author; // Extract author from request parameters
  const matchingBooks = [];

  // Iterate through the books object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.author === author) {
        // If the author matches, add the book to the matchingBooks array
        matchingBooks.push({ isbn: isbn, author: book.author, title: book.title, reviews: book.reviews });
      }
    }
  }

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    // Return the matching books as JSON response
    return res.status(200).json({ books: matchingBooks });
  } else {
    // If no matching books were found, return a 404 (Not Found) response
    return res.status(404).json({ message: "No books found for the specified author" });
  }
});

// Task 12
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author; // Extract author from request parameters
    const matchingBooks = await findBooksByAuthor(author);

    // Check if any matching books were found
    if (matchingBooks.length > 0) {
      // Return the matching books as JSON response
      return res.status(200).json({ books: matchingBooks });
    } else {
      // If no matching books were found, return a 404 (Not Found) response
      return res.status(404).json({ message: "No books found for the specified author" });
    }
  } catch (error) {
    // If an error occurs during the asynchronous operation, return a 500 (Internal Server Error) response
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function findBooksByAuthor(author) {
  const matchingBooks = [];

  // Iterate through the books object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.author === author) {
        // If the author matches, add the book to the matchingBooks array
        matchingBooks.push({ isbn: isbn, author: book.author, title: book.title, reviews: book.reviews });
      }
    }
  }

  return matchingBooks;
}
//End of Task 12


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // Extract author from request parameters
  const matchingBooks = [];

  // Iterate through the books object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title === title) {
        // If the author matches, add the book to the matchingBooks array
        matchingBooks.push({ isbn: isbn, author: book.author, title: book.title, reviews: book.reviews });
      }
    }
  }

  // Check if any matching books were found
  if (matchingBooks.length > 0) {
    // Return the matching books as JSON response
    return res.status(200).json({ books: matchingBooks });
  } else {
    // If no matching books were found, return a 404 (Not Found) response
    return res.status(404).json({ message: "No books found for the specified title" });
  }
});


// Task 13
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title; // Extract title from request parameters
    const matchingBooks = await findBooksByTitle(title);

    // Check if any matching books were found
    if (matchingBooks.length > 0) {
      // Return the matching books as JSON response
      return res.status(200).json({ books: matchingBooks });
    } else {
      // If no matching books were found, return a 404 (Not Found) response
      return res.status(404).json({ message: "No books found for the specified title" });
    }
  } catch (error) {
    // If an error occurs during the asynchronous operation, return a 500 (Internal Server Error) response
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

async function findBooksByTitle(title) {
  const matchingBooks = [];

  // Iterate through the books object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      if (book.title === title) {
        // If the title matches, add the book to the matchingBooks array
        matchingBooks.push({ isbn: isbn, author: book.author, title: book.title, reviews: book.reviews });
      }
    }
  }

  return matchingBooks;
}
// End of Task 13


// Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Extract author from request parameters
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
