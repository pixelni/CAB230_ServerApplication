const knex = require('../db/knex');

const getUserByEmail = (email) => {
  return knex('users').where({ email }).first();
};

const createUser = (user) => {
  return knex('users').insert(user);
};

const updateUserByEmail = (email, user) => {
  return knex('users').where({ email }).update(user);
};

module.exports = {
  getUserByEmail,
  createUser,
  updateUserByEmail
};
