const knex = require('knex')

const NursingService = {
    getAllNursing(knex){
        return knex.select('*').from('nursing')
           },

    insertNursing(knex, newNursing) {
                 return knex
                   .insert(newNursing)
                   .into('nursing')
                   .returning('*')
                   .then(rows => {
                    return rows[0]
                   })
           },

    getById(knex, id) {
               return knex.from('nursing').select('*').where('id', id).first()
             },

    getByUserId(knex, id){
      return knex.from('nursing').select('*').where('userid', id)
    },

    deleteNursing(knex, id) {
                   return knex('nursing')
                     .where({ id })
                     .delete()
                 },

    updateNursing(knex, id, newNursingFields) {
                       return knex('nursing')
                         .where({ id })
                         .update(newNursingFields)
                     },
}

module.exports = NursingService