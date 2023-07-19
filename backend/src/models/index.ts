import User from './user.js';
import Session from './session.js';
import Address from './address.js';
import Food from './food.js';
import Ingredient from './ingredient.js';
import Order from './order.js';
import FoodComponent from './foodComponent.js';
import OrderFood from './orderFood.js';
import UserAddress from './userAddress.js';
import FoodType from './foodType.js';
import LocString from './locString.js';
import Facility from './facility.js';
import FacilityManager from './facilityManager.js';
import Stock from './stock.js';
import DynamicText from './dynamicText.js';

/*****
* User + Session table associations BEGIN
******/

User.hasMany(Session, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'sessions'
});
Session.belongsTo(User, { targetKey: 'id' });

/*****
* User + Session table associations END
******/


// User.hasMany(Address, {
//   sourceKey: 'id',
//   foreignKey: 'userId',
//   as: 'addresses'
// });
// Address.belongsTo(User, { targetKey: 'id' });


/*****
* User + Address table associations BEGIN
******/

User.belongsToMany(Address, { through: UserAddress });
Address.belongsToMany(User, { through: UserAddress });
User.hasMany(UserAddress, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'user_addresses'
});
UserAddress.belongsTo(User, { targetKey: 'id' });
Address.hasOne(UserAddress, {
  sourceKey: 'id',
  foreignKey: 'addressId',
  as: 'address_user'
});
UserAddress.belongsTo(Address, { targetKey: 'id' });

/*****
* User + Address table associations END
******/


/*****
* Localization table associations BEGIN
******/

LocString.hasOne(FoodType, {
  sourceKey: 'id',
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
LocString.hasOne(FoodType, {
  sourceKey: 'id',
  foreignKey: 'descriptionLocId',
  as: 'descriptionLoc'
});
FoodType.belongsTo(LocString, { targetKey: 'id' });
// FoodType.hasOne(LocString, {   // ??? this would be more logical way, but it does not correspond to docs
//   sourceKey: 'id',
//   foreignKey: ''
// });

LocString.hasOne(Food, {
  sourceKey: 'id',
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
LocString.hasOne(Food, {
  sourceKey: 'id',
  foreignKey: 'descriptionLocId',
  as: 'descriptionLoc'
});
Food.belongsTo(LocString, { targetKey: 'id' });

LocString.hasOne(Ingredient, {
  sourceKey: 'id',
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
LocString.hasOne(Ingredient, {
  sourceKey: 'id',
  foreignKey: 'stockMeasureLocId',
  as: 'stockMeasureLoc'
});
Ingredient.belongsTo(LocString, { targetKey: 'id' });

LocString.hasOne(Facility, {
  sourceKey: 'id',
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
LocString.hasOne(Facility, {
  sourceKey: 'id',
  foreignKey: 'descriptionLocId',
  as: 'descriptionLoc'
});
Facility.belongsTo(LocString, { targetKey: 'id' });

LocString.hasOne(DynamicText, {
  sourceKey: 'id',
  foreignKey: 'locStringId',
  as: 'locString'
});
DynamicText.belongsTo(LocString, { targetKey: 'id' });

/*****
* Localization table associations END
******/


/*****
* Food + FoodType table associations BEGIN
******/

FoodType.hasMany(Food, {
  sourceKey: 'id',
  foreignKey: 'foodTypeId',
  as: 'foodType'
});
Food.belongsTo(FoodType, { targetKey: 'id' });

/*****
* Food + FoodType table associations END
******/


/*****
* Food + Ingredient table associations BEGIN
******/

Food.belongsToMany(Ingredient, {
  through: FoodComponent,
  scope: {
    compositeFood: false
  }
});
Ingredient.belongsToMany(Food, {
  through: FoodComponent,
  scope: {
    compositeFood: false
  }
});
Food.hasMany(FoodComponent, {
  sourceKey: 'id',
  foreignKey: 'foodId',
  as: 'food_components',
  constraints: false,
  scope: {
    compositeFood: false
  }
});
FoodComponent.belongsTo(Food, { targetKey: 'id' });
Ingredient.hasMany(FoodComponent, {
  sourceKey: 'id',
  foreignKey: 'componentId',
  as: 'ingredient_foods',
  constraints: false,
  scope: {
    compositeFood: false
  }
});
FoodComponent.belongsTo(Ingredient, { targetKey: 'id' });

/*****
* Food + Ingredient table associations END
******/

/*****
* Food + Food table associations BEGIN
******/

Food.belongsToMany(Food, {
  through: FoodComponent,
  scope: {
    compositeFood: true
  }
});
Food.hasMany(FoodComponent, {
  sourceKey: 'id',
  foreignKey: 'foodId',
  as: 'food_components',
  constraints: false,
  scope: {
    compositeFood: true
  }
});

Food.hasMany(FoodComponent, {
  sourceKey: 'id',
  foreignKey: 'componentId',
  as: 'complex_foods_components',
  constraints: false,
  scope: {
    compositeFood: true
  }
});

/*****
* Food + Food table associations END
******/


/*****
* Facility + Address + Managers table associations BEGIN
******/

Address.hasOne(Facility, {
  sourceKey: 'id',
  foreignKey: 'addressId',
  as: 'facility_address'
});
Facility.belongsTo(Address, { targetKey: 'id' });


Facility.belongsToMany(User, { through: FacilityManager });
User.belongsToMany(Facility, { through: FacilityManager });
Facility.hasMany(FacilityManager, {
  sourceKey: 'id',
  foreignKey: 'facilityId',
  as: 'facility_managers'
});
FacilityManager.belongsTo(Facility, { targetKey: 'id' });
User.hasOne(FacilityManager, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'manager_facility'
});
FacilityManager.belongsTo(User, { targetKey: 'id' });

/*****
* Facility + Address + Managers table associations END
******/

/*****
* Stock + Facility + Ingredient table associations BEGIN
******/

Ingredient.hasMany(Stock, {
  sourceKey: 'id',
  foreignKey: 'ingredientId',
  as: 'ingredient'
});
Stock.belongsTo(Ingredient, { targetKey: 'id' });


Facility.hasMany(Stock, {
  sourceKey: 'id',
  foreignKey: 'facilityId',
  as: 'facility'
});
Stock.belongsTo(Facility, { targetKey: 'id' });

/*****
* Stock + Facility + Ingredient table associations END
******/

/*****
* Order + Food table associations BEGIN
******/

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

/*****
* Order + Food table associations END
******/


export default {
  User, Session, Address, Food, Ingredient, Order, FoodComponent, OrderFood
};