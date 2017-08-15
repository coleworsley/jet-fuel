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
app.locals.title = 'JetFuel';
app.locals.folders = [
  {
    id: 1,
    name: 'hello',
  }
]

app.get('/api/v1/shorten', (req, res) => {
  res.status(200).json({"data":"hello"})
})

app.post('/api/v1/folders', (req, res) => {
  db('folders')
    .insert(req.body, 'id')
    .then(id => {
      const folder_id = id[0]
      return res.status(201).json({folder_id})
    })
    .catch(error => response.status(500).json({error}))
})


app.post('/api/v1/folders/:id/links', (req, res) => {
  // request.params
  db('folders')
  res.status(200).json({ "data":"hello", params: req.params })
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})
