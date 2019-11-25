const knex = require('knex')

const UserService = {
    getAllUser(knex){
        return knex.select('*').from('users')
           },

    insertUser(knex, newUser) {
                 return knex
                   .insert(newUser)
                   .into('users')
                   .returning('*')
                   .then(rows => {
                    return rows[0]
                   })
           },

    getById(knex, id) {
               return knex.from('users').select('*').where('id', id).first()
             },

    getByEmail(knex, email){
        return knex.from('users').select('*').where('email', email).first()
      },

    deleteUser(knex, id) {
                   return knex('users')
                     .where({ id })
                     .delete()
                 },

    updateUser(knex, id, newUserFields) {
                       return knex('users')
                         .where({ id })
                         .update(newUserFields)
                     }, 
}

module.exports = UserService