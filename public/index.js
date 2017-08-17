const fetchFolders = () => {
  fetch('api/v1/folders')
  .then(res => res.json())
  .then(folders => appendFolders(folders))
  .catch(error => appendFolders(error))
}

const folderButton = folder => `<button class="folder" value=${folder.id}>${folder.name}</button>`;
const folderDropdown = folder => `<option value=${folder.id}>${folder.name}</option>`;
const appendFolders = (folders) => {
  $('.folder-container').append(folders.map(folderButton));
  $('.folder-dropdown').append(folders.map(folderDropdown));
}

// Page Load
fetchFolders();

// Event Listeners
$('.folder-dropdown')

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
    appendFolders([{ id, name }]);
    $('.folder-dropdown').val(id);
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

$('.folder-container').on('click', '.folder', (e) => {
  $('.link-container').empty();
  $('#links-title').text(e.target.textContent)

  fetch(`api/v1/folders/${e.target.value}/links`)
  .then(res => res.json())
  .then(links => {
    $('.link-container').append(links.map(link => (
      `<div class="link">
        <a value=${link.id} href="api/v1/links/${link.id}" id="link">http://uniqueid:${link.id}</a>
        <p>Date Created: ${link.created_at}</p>
      </div>`
    )))
  })
})


$('.folder-dropdown').on('change', (e) => {
  console.log(e.target.value === 'new-folder')

  if (e.target.value !== 'new-folder') {
    $('.new-folder-form').addClass('form-hidden');
    $('.url-form').removeClass('form-hidden');
  } else {
    $('.url-form').addClass('form-hidden')
    $('.new-folder-form').removeClass('form-hidden')
  }

  $(e.target).find(':selected').text()
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
