require("./db/mongoose");
const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const path = require('path');
const hbs = require('hbs');

const app = express();
// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars, engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: "Task App",
    name: "Michael Gibbons"
  });
});


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;