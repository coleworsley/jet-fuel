const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./knex')

app.use(bodyParser.json());
app.use(express.static('public'));

app.route('/api/v1/folders')
.get((req, res) => {
  db('folders')
  .select()
  .then(folders => res.status(200).json(folders))
  .catch(error => res.status(404).json(error))
})
.post((req, res) => {
  const folder = req.body

  for (let requiredParam of ['name']) {
    if (!req.body[requiredParam]) {
      return res.status(422).json(`Missing required parameter ${requiredParam}`);
    }
  }
  // TODO: add error for duplicate also add to DB Migration
  db('folders')
  .insert(folder, 'id')
  .then(id => res.status(201).json(id[0]))
  .catch(error => res.status(500).json(error))
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
  console.log('in post')
  const link = Object.assign({}, req.body, {
    folder_id: parseInt(req.params.id),
    short_url: 'placeholder'
  });
  console.log(link);
  db('links')
  .insert(link, 'id')
  .then(id => res.status(201).json(id[0]))
  .catch(error => res.status(404).json(error))
})

app.route('/api/v1/links/:id')
.get((req, res) => {
  db('links')
  .select()
  .where('id', req.params.id)
  .then(link => res.status(302).redirect(link[0].original_url))
  .catch(error => res.status(404).json(error))
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})

module.exports = app;
