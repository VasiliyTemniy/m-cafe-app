import User from './user.js';
import Session from './session.js';
import Address from './address.js';
import Food from './food.js';
import Ingredient from './ingredient.js';
import Order from './order.js';
import FoodIngredient from './foodIngredient.js';
import OrderFood from './orderFood.js';

User.hasMany(Session, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'sessions'
});
Session.belongsTo(User, { targetKey: 'id' });

User.hasMany(Address, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'addresses'
});
Address.belongsTo(User, { targetKey: 'id' });

Food.belongsToMany(Ingredient, { through: FoodIngredient });
Ingredient.belongsToMany(Food, { through: FoodIngredient });
Food.hasMany(FoodIngredient, {
  sourceKey: 'id',
  foreignKey: 'foodId',
  as: 'food_ingredients'
});
FoodIngredient.belongsTo(Food, { targetKey: 'id' });
Ingredient.hasMany(FoodIngredient, {
  sourceKey: 'id',
  foreignKey: 'ingredientId',
  as: 'ingredient_foods'
});
FoodIngredient.belongsTo(Ingredient, { targetKey: 'id' });

Order.belongsToMany(Food, { through: OrderFood });
Food.belongsToMany(Order, { through: OrderFood });
Order.hasMany(OrderFood, {
  sourceKey: 'id',
  foreignKey: 'orderId',
  as: 'order_foods'
});
OrderFood.belongsTo(Order, { targetKey: 'id' });
Food.hasMany(OrderFood, {
  sourceKey: 'id',
  foreignKey: 'orderId',
  as: 'food_orders'
});
OrderFood.belongsTo(Food, { targetKey: 'id' });

export default {
  User, Session, Address, Food, Ingredient, Order, FoodIngredient, OrderFood
};