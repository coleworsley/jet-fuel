$('#url-submit').on('click', (e) => {
  e.preventDefault();

  const val = $('#url-input').val();

  fetch('http://localhost:3000/api/v1/shorten', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(val),
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log(err));
})

$('#new-folder-submit').on('click', (e) => {
  e.preventDefault();

  fetch('http://localhost:3000')
  .then(res => res.json())
  .then(data => console.log(data))
})
