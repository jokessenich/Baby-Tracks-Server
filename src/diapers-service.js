const knex = require('knex')

const DiapersService = {
  getAllDiapers(knex) {
    return knex.select('*').from('diapers')
  },

  insertDiaper(knex, newDiaper) {
    return knex
      .insert(newDiaper)
      .into('diapers')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },

  getById(knex, id) {
    return knex.from('diapers').select('*').where('id', id).first()
  },

  getByUserId(knex, id) {
    return knex.from('diapers').select('*').where('userid', id)
  },

  deleteDiaper(knex, id) {
    return knex('diapers')
      .where({ id })
      .delete()
  },

  updateDiaper(knex, id, newDiaperFields) {
    return knex('diapers')
      .where({ id })
      .update(newDiaperFields)
  },
}

module.exports = DiapersService