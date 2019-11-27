const knex = require('knex')

const SleepService = {
  getAllSleep(knex) {
    return knex.select('*').from('sleep')
  },

  insertSleep(knex, newSleep) {
    return knex
      .insert(newSleep)
      .into('sleep')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex.from('sleep').select('*').where('id', id).first()
  },


  getByUserId(knex, id) {
    return knex.from('sleep').select('*').where('userid', id)
  },

  deleteSleep(knex, id) {
    return knex('sleep')
      .where({ id })
      .delete()
  },

  updateSleep(knex, id, newSleepFields) {
    return knex('sleep')
      .where({ id })
      .update(newSleepFields)
  },
}

module.exports = SleepService