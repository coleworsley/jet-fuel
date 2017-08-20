// Importing express dependency and creating an instance of the express object
const express = require('express');
const app = express();

// Sets up environment variable to run on whatever port is passed in (defaults to 3000)
const port = (process.env.PORT || 3000);

// imports dependencies
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./knex')


// Everytime server is run it executes this middleware -
// body parser parses incoming requests before executing server code
// express.static is serving static html/css/javascript etc files from the public folder
app.use(bodyParser.json());
app.use(express.static('public'));

// handles get request to folders endpoint
app.get('/api/v1/folders', (req, res) => {

  // selects the folders data table in the jetfuel database and returns all folders
  // if successful or an error if not
  db('folders')
  .select()
  .then(folders => res.status(200).json(folders))
  .catch(error => res.status(404).json(error))
})


// handles post request to folders endpoint
app.post('/api/v1/folders', (req, res) => {
  const folder = req.body;

  // returns an error if the name parameter is not met
  for (let requiredParam of ['name']) {
    if (!req.body[requiredParam]) {
      return res.status(422).json(`Missing required parameter ${requiredParam}`);
    }
  }

  // inserts a new folder into the 'folders' data table and returns the id of the
  // folder that was inserted or an error. The error will result from a Duplication
  // so a 409 Conflict error will be sent
  db('folders')
  .insert(folder, 'id')
  .then(id => res.status(201).json(id[0]))
  .catch(error => res.status(409).json(error))
})

// handles get request for links from a particular folder. the :id is a dynamic route
// that can be accessed through req.params
app.get('/api/v1/folders/:id/links', (req, res) => {
  // selects all the data in the links datatable where the folder_id matches the
  // parameter id and returns all of the link data that met the requirements or
  // a 404 not found error
  db('links')
  .select()
  .where('folder_id', req.params.id)
  .then(links => {
    const updatedLinks = links.map(link => {
      const created_at = new Date(link.created_at).toDateString();
      return Object.assign({}, link, { created_at });
    })
    return res.status(200).json(updatedLinks)
  })
  .catch(error => res.status(404).json(error))
})

// handles post requests for adding a new link
app.post('/api/v1/folders/:id/links', (req, res) => {
  const link = Object.assign({}, req.body, {
    folder_id: parseInt(req.params.id),
    short_url: 'placeholder'
  });

  // finds the links datatable and inserts the link from the body passed in and
  // returns the link id that was inserted or an error

    db('links')
    .insert(link, 'id')
    .then(id => res.status(201).json(id[0]))
    .catch(error => res.status(404).json(error))
  })


// handles all routes for api/v1/links/:id (in this case just a get request)

app.route('/api/v1/links/:id')
.get((req, res) => {
  // selects all links that match the id parameter and then redirects to the original_url
  // that was created when the user submitted the link
  db('links')
  .select()
  .where('id', req.params.id)
  .then(link => {
    res.status(302).redirect(link[0].original_url)
  })
  .catch(error => res.status(404).json(error))
})

// sets up the server to listen on port 3000 by default or whatever environment port
// was passed in
app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})

module.exports = app;
