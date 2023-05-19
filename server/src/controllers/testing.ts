import { Router } from 'express'
import models from '../models'

const { User } = models

const testingRouter = Router()

testingRouter.post('/reset', async (req, res) => {
  await User.sync({force: true})

  res.status(204).end()
})

testingRouter.put('/admin/:id', async (req, res) => {

  const user = await User.findByPk(req.params.id)

  if (user) {

    user.admin = req.body.admin

    await user.save()

    res.json(user)
  } else {
    throw new Error('No entry')
  }

})

export default testingRouter