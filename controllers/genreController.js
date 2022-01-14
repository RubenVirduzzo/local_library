var genre = require('../models/genre');
const book = require('../models/book');
const async = require('async');
const {body, validationResult} = require('express-validator');


//Se muestran todos los genrees

exports.genre_list = function(req, res, next){

    genre.find()
        .sort([['name', 'ascending']])
        .exec(function(err, list_genre) {

            if (err) {return next(err)}
            res.render('genre_list', {title: 'Genre List', genre_list: list_genre})

        })
    
}

//Muestra detalles del genre

exports.genre_detail = function(req, res, next){

    async.parallel({

        genre: function(callback){

            genre.findById(req.params.id)
                .exec(callback);

        },

        genre_books: function(callback){

            book.find({'genre': req.params.id})
                .exec(callback);

        }
    }, function(err, results) {

        if (err) {return next(err)}
        if (results.genre == null) {

            const err = new Error('Genre not found');
            err.status = 404;
            return next(err);

        }

        res.render('genre_detail', {title: 'Genre detail', genre: results.genre, genre_book: results.genre_books});

    })
}

//Fromulario pàra crear genrees con GET

exports.genre_create_get = function(req, res){
    
    res.render('genre_form', {title: 'Create Genre'})
}

//Manejador de genre con POST

exports.genre_create_post = [

    body('name').trim().isLength({min:1}).escape().withMessage('Genre name required'),

    (req, res, next) => {
        
        const errors = validationResult(req)

        if (!errors.isEmpty()) {

            res.render('genre_form', {title: 'Create Genre', genre: genre, errors: errors.array()})
            return

        } else {

            const Genre = new genre({
                name: req.body.name
            })

            genre.findOne({name: req.body.name})
                .exec(function (err, found_genre) {

                    if (err) {return next(err)}

                    if (found_genre){

                        res.redirect(found_genre.url)

                    } else {

                        Genre.save(function(err){

                            if (err) {return next(err)}

                            res.redirect(Genre.url)

                        }) 
                    }
                })
        }
    }
    
]


//Formulario de delete para genre GET (DISPLAY)

exports.genre_delete_get = function(req, res){
    res.send("NOT IMPLEMENTED NOW: genre Delete GET");
}

//Formulario de delete para genre POST (DISPLAY)

exports.genre_delete_post = function(req, res){
    res.send("NOT IMPLEMENTED NOW: genre Delete POST");
}


//Formulario de update para genre GET (DISPLAY)

exports.genre_update_get = function(req, res){
    res.send("NOT IMPLEMENTED NOW: genre Update GET");
}

//Formulario de update para genre POST (DISPLAY)

exports.genre_update_post = function(req, res){
    res.send("NOT IMPLEMENTED NOW: genre Update POST");
}