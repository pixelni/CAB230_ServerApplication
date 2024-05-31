const knex = require('../db/knex');

const getAllVolcanoes = () => {
  return knex.select('*').from('volcanoes');
};

const getVolcanoById = (id) => {
  return knex('volcanoes').where({ id }).first();
};

module.exports = {
  getAllVolcanoes,
  getVolcanoById
};
