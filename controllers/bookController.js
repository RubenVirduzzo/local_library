const book = require("../models/book")
const author = require('../models/author')
const bookinstance = require('../models/bookinstance')
const genre = require('../models/genre')

const async = require('async')
const {body, validationResult} = require('express-validator');



exports.index = function (req, res) {

  async.parallel({

    book_count: function(callback) {
      book.countDocuments({}, callback)
    },

    book_instance_count: function(callback){
      bookinstance.countDocuments({}, callback)
    },

    book_instance_available_count: function(callback) {  
      bookinstance.countDocuments({status: 'Available'}, callback)
    },

    author_count: function(callback) {  
      author.countDocuments({}, callback)
    },

    genre_count: function(callback) {  
      genre.countDocuments({}, callback)
    }

  }, function(err, results) {
    res.render('index', {
      
      title: 'Local Librery Home', 
      error: err, 
      data:results
    })
  });
};

//Se muestran todos los bookes

exports.book_list = function (req, res, next) {

  book.find({}, 'title author')
    .sort({title: 1})
    .populate('author')
    .exec(function(err, list_books){

      if (err) {return next(err);}

      res.render('book_list',{
        title: 'Book List', 
        book_list: list_books
      });

    });

};

//Muestra detalles del book

exports.book_detail = function (req, res, next) {

  async.parallel({

    book: function(callback){

      book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },

    book_instance: function(callback){

      bookinstance.find({'book': req.params.id})
          .exec(callback);

    }
    }, function(err, results) {

      if (err) {return next(err)}
      if (results.book == null) {

          const err = new Error('Book not found');
          err.status = 404;
          return next(err);

      }
      res.render('book_details', {title: 'Book Details', book: results.book, book_instances: results.book_instance});

    })
};

//Fromulario pàra crear bookes con GET

exports.book_create_get = function (req, res, next) {
  async.parallel({

    authors: function(callback) {
      author.find(callback)
    },
    genres: function(callback) {
      genre.find(callback)
    }

  }, function(err,results) {

    if (err) {
      return next(err)
    }

    res.render('book_form', { 
      title: 'Create Book', 
      authors: results.authors, 
      genres: results.genres })
  })
};

//Manejador de book con POST

exports.book_create_post =  [
  // Convert genre to array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {

      if (typeof req.body.genre === 'undefined') 
      req.body.genre = []
      else
      req.body.genre = new Array(req.body.genre)

    }
    next()
  },
  // Validamos los datos
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be not empty!'),
  body('author', 'Author must be not empty!').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must be not empty!').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'Isbn must be not empty!').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // Procesamos
  (req, res, next) => {
    const errors = validationResult(req)

    // Create a book object con los datos buenos

    

    if (!errors.isEmpty()) {
      async.parallel({

        authors: function(callback) {
          author.find(callback)
        },
        genres: function(callback) {
          genre.find(callback)
        }
    
      }, function(err,results) {
    
        if (err) {
          return next(err)
        }
        
        for (let i = 0; i < results.genres.length; i++) {
          if(book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true'
          }
        }

        res.render('book_form', { 
          title: 'Create Book', 
          authors: results.authors, 
          genres: results.genres 
        })
      })
      return
    } else {
      // Data book are correct
      const Book = new book({
        title: req.book.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre
      })

      Book.save(function(err) {
        if (err) {
          return next(err)
        }

        res.redirect(Book.url)

      })
    }
  }

]

//Formulario de delete para book GET (DISPLAY)

exports.book_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED NOW: book Delete GET");
};

//Formulario de delete para book POST (DISPLAY)

exports.book_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED NOW: book Delete POST");
};

//Formulario de update para book GET (DISPLAY)

exports.book_update_get = function (req, res) {
  async.parallel({
    Book: function(callback) {
      book.findById(req.params.id).populate('author').populate('genre')
        .exec(callback)
    },
    authors: function(callback) {
      author.find(callback)
    },
    genres: function(callback) {
      genre.find(callback)
    }
  }, function(err, results) {
    if (error) {
      return next(error)
    }

    if (results.book === null) {
      const err = new Error
      err.status = 404
      return next(err)
    }

    for (let all_gen = 0; all_gen.length < results.book.genre.length ; all_gen++) {
      for (let book_gen=0 ; book_gen < results.book.gen.length  ;book_gen++) {
        if (results.genres[all_gen]._id.toString() === results.book.genre[book_gen]){
          results.genres[all_gen].checked='true'
        }
      }
    }
    res.render('book_form', {title: 'Update Book', authors: results.authors, genres: results.genres, book:results.Book})
  })
};

//Formulario de update para book POST (DISPLAY)

exports.book_update_post = [
  // Convert genre to array
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {

      if (typeof req.body.genre === 'undefined') 
      req.body.genre = []
      else
      req.body.genre = new Array(req.body.genre)

    }
    next()
  },
  // Validamos los datos
  body('title').trim().isLength({ min: 1 }).escape().withMessage('Title must be not empty!'),
  body('author', 'Author must be not empty!').trim().isLength({ min: 1 }).escape(),
  body('summary', 'Summary must be not empty!').trim().isLength({ min: 1 }).escape(),
  body('isbn', 'Isbn must be not empty!').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  // Procesamos
  (req, res, next) => {
    const errors = validationResult(req)

    // Create a book object con los datos buenos
    const Book = new book({
      title: req.book.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: (typeof req.body.genre==='undefined') ? [] : req.body.genre,
      _id: req.params.id
    })
    

    if (!errors.isEmpty()) {
      async.parallel({

        authors: function(callback) {
          author.find(callback)
        },
        genres: function(callback) {
          genre.find(callback)
        }
    
      }, function(err,results) {
    
        if (err) {
          return next(err)
        }
        
        for (let i = 0; i < results.genres.length; i++) {
          if(book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = 'true'
          }
        }

        res.render('book_form', { 
          title: 'Update Book', 
          authors: results.authors, 
          genres: results.genres 
        })
      })
      return
    } else {
      // Data book are correct
      

      Book.findByIdAndUpdate(req.params.id, book, {} ,function(err, thebook) {
        if (err) {
          return next(err)
        }

        res.redirect(thebook.url)

      })
    }
  }

]


