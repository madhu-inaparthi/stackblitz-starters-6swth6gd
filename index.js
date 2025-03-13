const express = require('express');
// You only need one JSON parsing middleware. Express.json() is sufficient.
const data = require('./data.json');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/books', (req, res) => {
  try {
    const book = req.body;

    // Validate that all required fields are provided.
    if(!book.title||!book.author||!book.genre||!book.copies||!book.year){
      res.status(400).json({error:'Missing required fields'})
      return;
    }
    const newBook = {
      book_id:data.length+1,
       title:book.title,
        author:book.author,
        genre:book.genre,
         copies:book.copies,
         year:book.year}
     data.push(newBook);
    return res.status(201).json(newBook)
  } catch (error) {
    return res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

app.get('/books', (req, res) => {
 
    return res.json(data);

});

app.get('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const book = data.find((book) => book.book_id === req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  return res.json(book);
});



app.put('/books/:id', (req, res) => {
  try {
   
    const id = req.params.id;
    const bookIndex = data.findIndex((book) => book.book_id == id);
      if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = { ...data[bookIndex], ...req.body };

    data[bookIndex] = updatedBook;
    return res.status(200).json({ msg: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/books/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const bookIndex = data.findIndex((book) => Number(book.book_id) === id);
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    data.splice(bookIndex, 1);
    return res.status(200).json({ msg: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
