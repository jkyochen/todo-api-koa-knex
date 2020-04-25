const Router = require('koa-router');
const { List, Create, Patch, Delete } = require('../controllers/todo');

module.exports = new Router()
  .get('/', List)
  .post('/', Create)
  .patch('/:id', Patch)
  .delete('/:id', Delete);
