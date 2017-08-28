const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./knex')


const requireHTTPS = (req, res, next) => {
  if (req.secure) {
    return next();
  }
  return res.redirect(`https://${req.headers.host}${req.url}`, 301);
}

app.use(requireHTTPS)
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/v1/folders', (req, res) => {
  db('folders')
  .select()
  .then(folders => res.status(200).json(folders))
  .catch(error => res.status(404).json(error))
})

app.post('/api/v1/folders', (req, res) => {
  const folder = req.body;

  for (let requiredParam of ['name']) {
    if (!req.body[requiredParam]) {
      return res.status(422).json(`Missing required parameter ${requiredParam}`);
    }
  }

  db('folders')
  .insert(folder, 'id')
  .then(id => res.status(201).json(id[0]))
  .catch(error => res.status(409).json(error))
})

app.get('/api/v1/folders/:id/links', (req, res) => {
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

app.post('/api/v1/folders/:id/links', (req, res) => {
  const link = Object.assign({}, req.body, {
    folder_id: parseInt(req.params.id),
    short_url: 'placeholder'
  });
  db('folders').select().then((data) => {
    db('links')
    .insert(link, 'id')
    .then(id => res.status(201).json(id[0]))
    .catch(error => res.status(404).json(error))
  })
})

app.route('/api/v1/links/:id')
.get((req, res) => {
  db('links')
  .select()
  .where('id', req.params.id)
  .then(link => {
    res.status(302).redirect(link[0].original_url)
  })
  .catch(error => res.status(404).json(error))
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})

module.exports = app;
