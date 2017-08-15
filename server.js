const express = require('express');
const app = express();
const port = (process.env.PORT || 3000);
const path = require('path');

app.use(express.static('public'));

app.post('/api/v1/shorten', (req, res) => {
  res.status(200).json({ "data":"hello" })
})

app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})
