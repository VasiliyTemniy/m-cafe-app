import bcryptjs from 'bcryptjs'
import { Router } from 'express'
import models from '../models'
import { isCustomRequest } from '../types/route'
import middleware from '../utils/middleware'

const User = models.User

const usersRouter = Router()

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const existingUser = await User.findOne({
    where: {
      username: username
    }
  })
  if (existingUser) {
    return res.status(400).json({ error: 'username must be unique' })
  }

  if (password === undefined || password.length <= 3) {
    return res.status(400).json({ error: 'password must be longer than 3 symbols' })
  } else {
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(password, saltRounds)

    const user = {
      username,
      name,
      passwordHash
    }

    const savedUser = await User.create(user)

    res.status(201).json(savedUser)
  }
})

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash', 'disabled', 'admin'] },
    include: [
      {
        // model: Blog,
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] }
      }
    ],
  })

  res.json(users)
})

usersRouter.put(
  '/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  async (req, res) => {
    const { username, name, password } = req.body

    if (password === undefined || password.length <= 3) {
      return res
        .status(400)
        .json({ error: 'Username and password must be longer than 3 symbols' })
    } else {
      if (isCustomRequest(req) && req.userId !== req.params.id) {
        return res.status(401).json({ error: 'User attempts to change another users data or invalid user id' })
      } else {
        const saltRounds = 10
        const passwordHash = await bcryptjs.hash(password, saltRounds)

        const user = await User.findByPk(req.params.id)

        if (user) {
          user.username = username
          user.name = name
          user.passwordHash = passwordHash

          await user.save()

          res.json(user)
        }
      }
    }
  },
)

usersRouter.get('/:id', async (request, response) => {

  let where = {}
  if (request.query.read) {
    where = { read: request.query.read === 'true' }
  }

  const user = await User.findByPk(request.params.id, {
    attributes: { exclude: ['createdAt', 'updatedAt', 'passwordHash', 'disabled', 'admin'] }
  })

  if (user) {
    response.json(user)
  } else {
    throw new Error('No user entry')
  }
})

export default usersRouter