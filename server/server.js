require('./config/config');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

var {
    mongoose
} = require('./db/mongoose');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: false
}));
// request'in body'sini okuyabilmemizi sağlıyor

app.post('/postTodo', (req, res) => {
    new Todo({
        text: req.body.text
        //tam olarak bu satırı bodyParser sayesinde kullanabiliyoruz
    }).save().then((doc) => {
        res.redirect('/');
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/', (req, res) => {
    Todo.find().then((todos) => {
        res.render('index', {
            todos
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.get('/getTodo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id))
        return res.status(404).send('Olmadı');

    Todo.findById(id).then((todo) => {
        if (todo)
            res.render('detail', ({
                todo
            }));
        else
            res.status(404).send();
    }, (e) => {
        res.status(400).send();
    });
});

app.get('/deleteTodo/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id))
        return res.status(404).send('Olmadı');

    Todo.findByIdAndDelete(id).then((todo) => {
        if (todo)
            res.redirect('/')
        else
            res.status(404).send();
    }, (e) => {
        res.status(400).send();
    });
});

app.get('/set/:id', (req, res) => {
    var id = req.params.id;
    Todo.findById(id).then((todo) => {
        res.render('patch', ({
            id,
            text: todo.text
        }));
    }, (e) => {
        res.status(400).send('Error');
    });
});

app.post('/setTodo/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    body.completed = (body.completed === 'true') ? true : false;

    if (!ObjectID.isValid(id))
        return res.status(404).send('Olmadı');

    if (_.isBoolean(body.completed) && body.completed)
        body.completedAt = new Date().getTime();
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
        _id: id
    }, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo)
            return res.status(404).send();
        res.redirect('/');
    }, (e) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {
    app
};