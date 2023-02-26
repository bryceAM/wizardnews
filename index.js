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

// const postBank = require("./postBank");
const {find, list} = require("./postBank");


app.use(express.static(__dirname + "/public"));

// // req = request, res = result
app.get('/', (req, res) => {
    console.log('Made it to the root!')
    // sending back a string, so you need the quotes.
    // remember you're working with database strings to be translated to objects once they get back to the client
    const posts = list();

    const postsPage = `<!DOCTYPE html>
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
           <span class="news-position">${post.id}. ▲</span><a href="/posts/${post.id}">${post.title}</a>
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

    res.send(postsPage);
})

// .static('public') -> public is a folder name
// only for if you have a .html file in the public folder
// app.use('/staticPath', express.static('public'))

app.get('/posts/:id', (req, res, next) => {
    const {id} = req.params;
    console.log('Made it to the post id path!')
    let post = find(id);

    if (!post.id) {
        next();
    } else {
        const singlePost = `<!DOCTYPE html>
        <html>
        <head>
            <title>Wizard News</title>
            <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
            <div class="news-list">
            <header><img src="/logo.png"/>Wizard News</header>
            
               <div class='news-item'>
               <p>
               <span class="news-position">${post.id}. ▲</span>${post.title}
               <small>(by ${post.name})</small>
               </p>
               <small class="news-info">
               ${post.upvotes} upvotes | ${post.date}
               </small>
               </div>

            </div>
        </body>
        </html>`

        res.send(singlePost);
    }
})

// * is a catchall
app.get('*', (req, res) => {
    const pageNotFound = `<!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
      </div>
    </body>
    </html>`

    res.send(pageNotFound);
})

app.listen(3000, () => {
    console.log("Server is running! ...")
})