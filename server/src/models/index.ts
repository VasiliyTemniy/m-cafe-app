import User from './user.js'
import Session from './session.js'

User.hasMany(Session, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'sessions'
})
Session.belongsTo(User, { targetKey: 'id' })

export default {
  User, Session
}