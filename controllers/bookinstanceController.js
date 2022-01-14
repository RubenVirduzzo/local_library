const Book = require('../models/book')
const bookinstance = require('../models/bookinstance');
const {body, validationResult} = require('express-validator');

//Se muestran todos los bookinstancees

exports.bookinstance_list = function(req, res){
    bookinstance.find()
        .populate('book')
        .exec(function(err, list_bookinstances){
            if (err) {return next(err)}
            res.render('bookinstance_list', {title: 'Book Instance List', bookinstance_list: list_bookinstances});
        })
    //res.send("NOT IMPLEMENTED NOW: bookinstance List");
}

//Muestra detalles del bookinstance

exports.bookinstance_detail = function(req, res){
    res.send("NOT IMPLEMENTED NOW: bookinstance Detail" + req.params.id);
}

//Fromulario pàra crear bookinstancees con GET

exports.bookinstance_create_get = function(req, res){
    Book.find({}, 'title')
        .exec(function (err, books){
            if (err) {return next(err)}
            res.render('bookinstance_form', {title: 'Create BookInstance', book_list: books})
        })
    }

//Manejador de bookinstance con POST

exports.bookinstance_create_post = [
    body('book', 'book must be specified').trim().isLength({ min:1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min:1 }).escape(),
    body('status', 'Status must be specified').escape(),
    body('due_back', 'Invalid date').optional({checkFalsy: true}).isISO8601().toDate(),

    (req, res, next) => {
        const errors = validationResult(req)

        const Bookinstance = new bookinstance({
            book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back
        })
        if (!errors.isEmpty()) {
            Book.find({}, 'title')
                .exec(function(err, books) {
                    if (err) {
                        return next(err)
                    }

                    res.render('bookinstance_form', {title: 'Create BookInstance', 
                                                     book_list: books, 
                                                     selected_books: Bookinstance.book._id, 
                                                     errors: errors.array(), 
                                                     bookinstance: bookinstance
                    })
            return

                })
        } else {
            Bookinstance.save(function(err) {
                if (err) {
                    return next(err)
                }
                res.redirect(bookinstance.url)
            })
        }
    }

]


//Formulario de delete para bookinstance GET (DISPLAY)

exports.bookinstance_delete_get = function(req, res){
    res.send("NOT IMPLEMENTED NOW: bookinstance Delete GET");
}

//Formulario de delete para bookinstance POST (DISPLAY)

exports.bookinstance_delete_post = function(req, res){
    res.send("NOT IMPLEMENTED NOW: bookinstance Delete POST");
}


//Formulario de update para bookinstance GET (DISPLAY)

exports.bookinstance_update_get = function(req, res){
    res.send("NOT IMPLEMENTED NOW: bookinstance Update GET");
}

//Formulario de update para bookinstance POST (DISPLAY)

exports.bookinstance_update_post = function(req, res){
    res.send("NOT IMPLEMENTED NOW: bookinstance Update POST");
}