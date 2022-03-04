﻿const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const Student = require('mongoose').model('Student');

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const article = new Article();
    article.title = req.body.title;
    article.content = req.body.content;
    //article.creator = req.body.username;
    console.log(req.body)
    //
    //
    Student.findOne({username: req.body.username}, (err, student) => {

        if (err) { return getErrorMessage(err); }
        //
        req.id = student._id;
        console.log('student._id',req.id);

	
    }).then( function () 
    {
        article.creator = req.id
        console.log('req.student._id',req.id);

        article.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(article);
            }
        });
    
    });
};
//
// exports.list = function (req, res, next, id) {
//     Student.findOne({username: req.body.username}, (err, student) => {

//         if (err) { return getErrorMessage(err); }
//         //
//         req.id = student._id;
//         console.log('student._id',req.id);
	
//     }).then( function () 
//     {
        
//         Article.findById(id).populate('creator', 'firstName lastName fullName').exec((err, article) => {
//             if (err) return next(err);
//             if (!article) return next(new Error('Failed to load article '+ id));
//                 req.article = article;
//                 console.log('in articleById:', req.article)
//                 next();
//             });
//     });

// };

// exports.list = function (req, res) {
//     Article.find().sort('-created').populate('creator', 'firstName lastName fullName').exec((err, articles) => {
//         if (err) {
//             return res.status(400).send({
//                 message: getErrorMessage(err)
//             });
//         } else {
//             //res.status(200).json(articles);
//             if (req.article.creator.id == req.id) {
//                 res.status(200).json(articles);
//                 console.log(articles.creator.id)
//             }
//         }
//     });
// };


// exports.list = function (req, res, next, id) {
//     console.log("username")
//     Article.findById(id).populate('creator', 'firstName lastName fullName').exec((err, article) => {if (err) return next(err);
//         console.log("herererereererere")
//         if (!article) return next(new Error('Failed to load article ' + id));
//         req.article = article;
//         console.log('in articleById:', req.article)
//         next();
//     });
// };

exports.list = function (req, res) {
    Article.find().sort('-created').populate('creator', 'firstName lastName fullName').exec((err, articles) => {
    if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(articles);
    }
});
};

//
exports.articleByID = function (req, res, next, id) {
    Article.findById(id).populate('creator', 'firstName lastName fullName').exec((err, article) => {if (err) return next(err);
    if (!article) return next(new Error('Failed to load article '
            + id));
        req.article = article;
        console.log('in articleById:', req.article)
        next();
    });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.article);
};
//
exports.update = function (req, res) {
    console.log('in update:', req.article)
    const article = req.article;
    article.title = req.body.title;
    article.content = req.body.content;
    article.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(article);
        }
    });
};
//
exports.delete = function (req, res) {
    const article = req.article;
    article.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(article);
        }
    });
};
//The hasAuthorization() middleware uses the req.article and req.student objects
//to verify that the current student is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - creator: ',req.article.creator)
    console.log('in hasAuthorization - student: ',req.id)
    //console.log('in hasAuthorization - student: ',req.student._id)


    if (req.article.creator.id !== req.id) {
        return res.status(403).send({
            message: 'Student is not authorized'
        });
    }
    next();
};
