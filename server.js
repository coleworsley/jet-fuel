const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);
const path = require('path');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const db = require('knex')(config);

app.use(bodyParser.json());
app.use(express.static('public'));


app.route('/api/v1/folders')
.get((req, res) => {
  db('folders')
  .select()
  .then(folders => res.status(200).json(folders))
  .catch(error => res.status(404).json(error))
// TODO: add error for duplicate also add to DB Migration
})
.post((req, res) => {
  db('folders')
  .insert(req.body, 'id')
  .then(id => res.status(201).json(id[0]))
  .catch(error => res.status(500).json(error))
})

app.route('/api/v1/folders/:id/links')
.get((req, res) => {
  db('links')
  .select()
  .where('folder_id', req.params.id)
  .then(links => {
    return res.status(200).json(links)})
  .catch(error => res.status(404).json(error))
})
.post((req, res) => {
  const link = Object.assign({}, req.body, { folder_id: req.params.id, short_url: 'test' });

  db('links')
  .insert(link, 'id')
  .then(id => {
    const link_id = id[0];
    return res.status(201).json({ link_id })
  })
  .catch(error => res.status(404).json(error))
})

app.route('/api/v1/links/:id')
.get((req, res) => {
  db('links')
  .select()
  .where('id', req.params.id)
  .then(link => res.redirect(link[0].original_url))
  .catch(error => res.status(404).json(error))
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})
