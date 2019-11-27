module.exports = {
    PORT: process.env.PORT || 8001,
    NODE_ENV: process.env.NODE_ENV || 'develpment',
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://dunder_mifflin:a@localhost/babytracks",
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000"
  }