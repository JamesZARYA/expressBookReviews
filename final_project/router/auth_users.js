const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate username and password
  if (!username || !password) {
    // If either username or password is missing, return a 400 (Bad Request) response
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username and password are valid (dummy check for demonstration)
  if (!isValidCredentials(username, password)) {
    // If the credentials are invalid, return a 401 (Unauthorized) response
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // If the credentials are valid, generate a JWT token
  const token = jwt.sign({ username: username }, 'your_secret_key');

  // Return the JWT token as part of the response
  return res.status(200).json({ token: token });
});

// Dummy function to check if the provided username and password are valid
function isValidCredentials(username, password) {
  // Dummy logic to check if the provided username and password are valid (replace with your actual authentication logic)
  // For demonstration, assume valid credentials are hardcoded
  const validUsername = "user";
  const validPassword = "password";
  return username === validUsername && password === validPassword;
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Extract the username from the JWT token stored in the request headers
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, 'your_secret_key');
  const username = decodedToken.username;

  // Check if the reviews object for the specified ISBN already exists
  if (!books[isbn]) {
    // If the ISBN does not exist in the books object, return a 404 (Not Found) response
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for the given ISBN
  if (books[isbn].reviews[username]) {
    // If the user has already posted a review, update the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully" });
  } else {
    // If the user has not posted a review, add a new review
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Extract the username from the JWT token stored in the request headers
  const token = req.headers.authorization;
  const decodedToken = jwt.verify(token, 'your_secret_key');
  const username = decodedToken.username;

  // Check if the reviews object for the specified ISBN exists
  if (!books[isbn]) {
    // If the ISBN does not exist in the books object, return a 404 (Not Found) response
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has posted a review for the given ISBN
  if (!books[isbn].reviews[username]) {
    // If the user has not posted a review, return a 404 (Not Found) response
    return res.status(404).json({ message: "Review not found for the current user" });
  }

  // Delete the review associated with the current user
  delete books[isbn].reviews[username];

  // Return a 200 (OK) response indicating successful deletion
  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
