$('#url-submit').on('click', (e) => {
  e.preventDefault();

  const val = $('#url-input').val();

  fetch('api/v1/shorten', {
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
