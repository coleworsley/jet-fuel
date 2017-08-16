const fetchFolders = () => {
  fetch('api/v1/folders')
  .then(res => res.json())
  .then(folders => appendFolders(folders))
  .catch(error => appendFolders(error))
}
fetchFolders();

const folderButton = folder => `<button class="folder" value=${folder.id}>${folder.name}</button>`;
const folderDropdown = folder => `<option value=${folder.id}>${folder.name}</option>`;
const appendFolders = (folders) => {
  $('.folder-container').append(folders.map(folderButton));
  $('.folder-dropdown').append(folders.map(folderDropdown));
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
  .then(id => {
    appendFolders([{ id, name }])
    $('.folder-dropdown').val(id)
  })
  .catch(error => console.log(error))
})


$('#url-submit').on('click', (e) => {
  e.preventDefault();

  const original_url = $('#url-input').val();
  const folder_id = $('.folder-dropdown').val();
  fetch(`api/v1/folders/${folder_id}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({original_url})
  })
  .then(res => res.json())
  .then(link => console.log(link))

})


$('.folder-dropdown').on('click', (e) => {
  console.log($('.folder-dropdown').find(':selected').text())
})

// $('#url-submit').on('click', (e) => {
//   e.preventDefault();
//
//   const val = $('#url-input').val();
//
//   fetch('api/v1/shorten', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(val),
//   })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(err => console.log(err));
// })
