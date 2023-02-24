// setup express
const express = require('express');
const app = express();

// middleware
// morgan helps with development, will show us errors in console
const morgan = require('morgan');
app.use(morgan('dev'));

// helps us receive and work with objects
app.use(express.json());

// helps prevent errors related to security 
const cors = require('cors');
app.use(cors());

const postBank = require("./postBank");

app.use(express.static(__dirname + "/public"));

// // req = request, res = result
app.get('/', (req, res) => {
    console.log('Made it to the root!')
    // sending back a string, so you need the quotes.
    // remember you're working with database strings to be translated to objects once they get back to the client
    const posts = postBank.list();
    const vDOM = `<!DOCTYPE html>
    <html>
    <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
        <div class="news-list">
        <header><img src="/logo.png"/>Wizard News</header>
        ${posts.map((post) => `
           <div class='news-item'>
           <p>
           <span class="news-position">${post.id}. ▲</span>${post.title}
           <small>(by ${post.name})</small>
           </p>
           <small class="news-info">
           ${post.upvotes} upvotes | ${post.date}
           </small>
           </div>`
          )
          .join("")}
        </div>
    </body>
    </html>`;
    res.send(vDOM);
})

// .static('public') -> public is a folder name
// only for if you have a .html file in the public folder
// app.use('/staticPath', express.static('public'))

app.get('/posts/:id', (req, res, next) => {
    const {id} = req.params;
    console.log('Made it to the post id path!')
    find(id);


    // if (id == 'doesNotExist') {
    //     next();
    // } else {
    //     res.send(`<div>you chose ${id}!</div>`)
    // }
})

// * is a catchall
app.get('*', (req, res) => {
    // sending html error message instead of error object
    res.status(404).send('<div>404 error!</div>')
    // sending error object instead of html
    res.status(404).send({error: 'oh nose!', message: 'page does not exist!'})
})

app.listen(3000, () => {
    console.log("Server is running! ...")
})