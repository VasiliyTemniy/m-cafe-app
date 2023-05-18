require('dotenv').config()
import { Sequelize, QueryTypes } from 'sequelize'

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const main = async () => {
  try {
    await sequelize.authenticate()
    const blogs = await sequelize.query('SELECT * FROM blogs', { type: QueryTypes.SELECT })
    console.log(blogs)
    console.log('To be clear, I do not actually know if the following is necessary, but why not?')
    for (const blog of blogs) {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`)
    }
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()