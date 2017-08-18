// Function declarations
const fetchFolders = () => {
  fetch('api/v1/folders')
  .then(res => res.json())
  .then(folders => appendFolders(folders))
  .catch(error => appendFolders(error))
}

const folderButton = folder => `<button class="folder" value=${folder.id}>${folder.name}</button>`;
const folderDropdown = folder => `<option value=${folder.id}>${folder.name}</option>`;
const createFolder = link => `
  <div class="link">
    <a value=${link.id} href="api/v1/links/${link.id}" id="link">http://uniqueid:${link.id}</a>
    <p>Date Created: ${link.created_at}</p>
  </div>`

const appendFolders = (folders) => {
  $('.folder-container').append(folders.map(folderButton));
  $('.folder-dropdown').append(folders.map(folderDropdown));
}

const handleNewFolderSubmit = e => {
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
    $('#new-folder-input').val('')
    handleFolderDropdown(e);
  })
  .catch(error => $(e.target).text(error))
}

const handleLinkSubmit = e => {
  e.preventDefault();

  const original_url = $('#url-input').val();
  const folder_id = $('.folder-dropdown').val();
  const $urlInput = $('#url-input')

  fetch(`api/v1/folders/${folder_id}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({original_url})
  })
  .then(res => res.json())
  .then(link => {
    $(`.folder-container .folder[value=${folder_id}]`).trigger('click');
    $('#url-input').val('')
  })
  .catch(error => {
    $('#url-input').val(error)
  })
}

const handleFolderClick = e => {
  $('.folder-container').find('.active-folder').removeClass('active-folder');
  $(e.target).toggleClass('active-folder');
  $('.link-container').empty();
  $('#links-title').text(e.target.textContent);

  fetch(`api/v1/folders/${e.target.value}/links`)
  .then(res => res.json())
  .then(links => {
    $('.link-container').append(links.map(link => createFolder(link)));
  })
  .catch(error => {
    $('.link-container').append(`<p>There was an error</p>`)
  })
}

const handleFolderDropdown = e => {
  if (e.target.value !== 'new-folder') {
    $('.new-folder-form').addClass('form-hidden');
    $('.url-form').removeClass('form-hidden');
  } else {
    $('.url-form').addClass('form-hidden')
    $('.new-folder-form').removeClass('form-hidden')
  }
}

// Page Load
fetchFolders();

// Event Listeners
$('#new-folder-submit').on('click', handleNewFolderSubmit);
$('#url-submit').on('click', handleLinkSubmit);
$('.folder-container').on('click', '.folder', handleFolderClick);
$('.folder-dropdown').on('change', handleFolderDropdown)
