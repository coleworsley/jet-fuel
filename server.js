const express = require('express');
const app = express();
const cors = require('express-cors');
const port = (process.env.PORT || 3000);
const path = require('path');

app.use(cors());

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'index.html'))
})

app.post('/api/v1/shorten', (req, res) => {
  console.log('in shorten')
  res.status(200).json({ "data":"hello" })
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})
