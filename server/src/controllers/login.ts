import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { Router } from 'express'
import models from '../models'
import middleware from '../utils/middleware'
import config from '../utils/config'
import { isCustomRequest } from '../types/route'

const loginRouter = Router()
const { User, Session } = models

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.scope('all').findOne({
    where: {username: username}
  })
  const passwordCorrect =
    user === null ? false : await bcryptjs.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    })
  } else if (user.disabled) {
    return res.status(401).json({
      error: 'Your account have been banned. Contact admin to unblock account',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: config.TOKEN_TTL })

  const session = {
    userId: user.id,
    token
  }

  await Session.create(session)

  res.status(200).send({ token, username: user.username, name: user.name, id: userForToken.id })
})

loginRouter.get(
  '/logout',
  middleware.verifyToken,
  middleware.userExtractor,
  async (req, res) => {

    if (isCustomRequest(req) && req.userId && req.token) {
      await Session.destroy({
        where: {
          userId: req.userId,
          token: req.token
        }
      })
    }

    res.status(204).end()
  }
)

module.exports = loginRouter