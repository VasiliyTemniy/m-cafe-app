import { Router } from 'express'
import models from '../models'
import { isCustomRequest } from '../types/route';
import middleware from '../utils/middleware'

const { User, Session } = models

const adminRouter = Router();

adminRouter.put(
  '/users/:id',
  middleware.verifyToken,
  middleware.userExtractor,
  middleware.sessionCheck,
  async (req, res) => {

    if (isCustomRequest(req) && req.user) {
      const userAdmin = req.user

      if (!userAdmin.admin) {
        res.status(403).json({ error: 'You have no admin permissions' })
      }

      const userSubject = await User.scope('all').findByPk(req.params.id)

      if (!userSubject) {
        res.status(403).json({ error: `No user entry with this id ${req.params.id}` })
      } else {
        userSubject.disabled = req.body.disabled

        if (userSubject.disabled) {
          await Session.destroy({
            where: {
              userId: userSubject.id,
            }
          })
        }

        await userSubject.save()
        res.json(userSubject)
      }

    }
    
  }
)

export default adminRouter