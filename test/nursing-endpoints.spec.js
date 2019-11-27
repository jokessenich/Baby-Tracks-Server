 /*const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')


describe.only('Nursing endpoints', function() {
    let db
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: `${process.env.DATABASE_URL}`,
      })
      app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('nursing').truncate())

     afterEach('cleanup', () => db('nursing').truncate())

     context('Given there are nursing entries in the database', () => {
        const testNursings = [
          {
            id: 1,
            starttime: '2019-01-22T16:28:32.615Z',
            endtime: '2019-01-22T16:32:32.615Z',
            rightside: 500,
            leftside: 500,
            duration: 1000,
            userid: 1
          },
          {
            id: 2,
            starttime: '2019-01-22T16:22:32.615Z',
            endtime: '2019-01-22T16:34:32.615Z',
            rightside: 600,
            leftside: 600,
            duration: 1200,
            userid: 2
          },
        ];
        beforeEach('insert nursings', () => {
            return db
              .into('nursing')
              .insert(testNursings)
          })

          it('GET /nursing responds with 200 and all of the Nursings', () => {
                  return supertest(app)
                    .get('/api/nursing')
                    .expect(200, testNursings)
                })
})
})
*/