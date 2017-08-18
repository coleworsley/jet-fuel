const folders = [
  {
    id: 1,
    name: 'Concerts',
  },
  {
    id: 2,
    name: 'Documentation',
  },
  {
    id: 3,
    name: 'Social',
  },
]

const links = [
  {
    id: 1,
    original_url: 'http://www.ticketmaster.com/section/concerts',
    short_url: 'placeholder',
    folder_id: 1,
  },
  {
    id: 2,
    original_url: 'http://www.westword.com/concerts',
    short_url: 'placeholder',
    folder_id: 1,
  },
  {
    id: 3,
    original_url: 'https://developer.mozilla.org/en-US/',
    short_url: 'placeholder',
    folder_id: 2,
  },
  {
    id: 4,
    original_url: 'https://expressjs.com/en/guide/routing.html',
    short_url: 'placeholder',
    folder_id: 2,
  },
  {
    id: 5,
    original_url: 'http://knexjs.org/',
    short_url: 'placeholder',
    folder_id: 2,
  },
  {
    id: 6,
    original_url: 'https://www.facebook.com/',
    short_url: 'placeholder',
    folder_id: 3,
  },
]

exports.seed = function(knex, Promise) {
  return      knex('links').del()
  .then(() => knex('folders').del())
  .then(() => Promise.all(folders.map(folder => knex('folders').insert(folder))))
  .then(() => Promise.all(links.map(link => knex('links').insert(link))))
};
