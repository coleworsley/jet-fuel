const folders = [
  {
    name: 'Concerts',
    id: 1,
  },
  {
    name: 'Documentation',
    id: 2
  },
  {
    name: 'Social',
    id: 3
  },
]

const links = [
  {
    original_url: 'http://www.ticketmaster.com/section/concerts',
    short_url: 'placeholder',
    folder_id: 1,
  },
  {
    original_url: 'http://www.westword.com/concerts',
    short_url: 'placeholder',
    folder_id: 1,
  },
  {
    original_url: 'https://developer.mozilla.org/en-US/',
    short_url: 'placeholder',
    folder_id: 2,
  },
  {
    original_url: 'https://expressjs.com/en/guide/routing.html',
    short_url: 'placeholder',
    folder_id: 2,
  },
  {
    original_url: 'http://knexjs.org/',
    short_url: 'placeholder',
    folder_id: 2,
  },
  {
    original_url: 'https://www.facebook.com/',
    short_url: 'placeholder',
    folder_id: 3,
  },
]

exports.seed = function(knex, Promise) {
  return      knex('links').del()
  .then(() => knex('folders').del())
  .then(() => Promise.all(folders.map(folder => knex('folders').insert(folder, '*'))))
  .then((ids) => Promise.all(links.map(link => knex('links').insert(link))))
};
