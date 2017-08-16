const fetchFolders = () => {
  fetch('api/v1/folders')
  .then(res => res.json())
  .then(folders => appendFolders(folders))
  .catch(error => appendFolders(error))
}
fetchFolders();

const appendFolders = (folders) => {
  $('.folder-container').append(folders.map(folder => (
    `<button class="folder" value=${folder.id}>${folder.name}</button>`
  )))

  $('.folder-dropdown').append(folders.map(folder => (
    `<option>${folder.name}</option>`
  )))
}

//  Event Listeners
$('#new-folder-submit').on('click', (e) => {
  e.preventDefault();
  const name = $('#new-folder-input').val();

  fetch('api/v1/folders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name })
  })
  .then(res => res.json())
  .then(id => console.log(id))
  .catch(error => console.log(error))
})

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
