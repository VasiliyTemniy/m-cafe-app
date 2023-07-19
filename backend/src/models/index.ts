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
import DynamicModule from './dynamicModule.js';

/*****
* User + Session table associations BEGIN
******/

User.hasMany(Session, {
  foreignKey: 'userId',
  as: 'sessions'
});
Session.belongsTo(User);

/*****
* User + Session table associations END
******/


/*****
* User + Address table associations BEGIN
******/

User.belongsToMany(Address, { through: UserAddress });
Address.belongsToMany(User, { through: UserAddress });
User.hasMany(UserAddress, {
  foreignKey: 'userId',
  as: 'user_addresses'
});
UserAddress.belongsTo(User, { targetKey: 'id' });
Address.hasOne(UserAddress, {
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
  foreignKey: 'nameLocId',
  as: 'foodTypeNameLoc'
});
LocString.hasOne(FoodType, {
  foreignKey: 'descriptionLocId',
  as: 'foodTypeDescriptionLoc'
});
FoodType.belongsTo(LocString, {
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
FoodType.belongsTo(LocString, {
  foreignKey: 'descriptionLocId',
  as: 'descriptionLoc'
});

LocString.hasOne(Food, {
  foreignKey: 'nameLocId',
  as: 'foodNameLoc'
});
LocString.hasOne(Food, {
  foreignKey: 'descriptionLocId',
  as: 'foodDescriptionLoc'
});
Food.belongsTo(LocString, {
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
Food.belongsTo(LocString, {
  foreignKey: 'descriptionLocId',
  as: 'descriptionLoc'
});

LocString.hasOne(Ingredient, {
  foreignKey: 'nameLocId',
  as: 'ingredientNameLoc'
});
LocString.hasOne(Ingredient, {
  foreignKey: 'stockMeasureLocId',
  as: 'stockMeasureLoc'
});
Ingredient.belongsTo(LocString, {
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
Ingredient.belongsTo(LocString, {
  foreignKey: 'stockMeasureLocId',
  as: 'stockMeasureLoc'
});

LocString.hasOne(Facility, {
  foreignKey: 'nameLocId',
  as: 'facilityNameLoc'
});
LocString.hasOne(Facility, {
  foreignKey: 'descriptionLocId',
  as: 'facilityDescriptionLoc'
});
Facility.belongsTo(LocString, {
  foreignKey: 'nameLocId',
  as: 'nameLoc'
});
Facility.belongsTo(LocString, {
  foreignKey: 'descriptionLocId',
  as: 'descriptionLoc'
});

LocString.hasOne(DynamicModule, {
  foreignKey: 'locStringId',
  as: 'locString'
});
DynamicModule.belongsTo(LocString);

/*****
* Localization table associations END
******/


/*****
* Food + FoodType table associations BEGIN
******/

FoodType.hasMany(Food, {
  foreignKey: 'foodTypeId',
  as: 'foodType'
});
Food.belongsTo(FoodType);

/*****
* Food + FoodType table associations END
******/


/*****
* Food + Ingredient + Food table associations BEGIN
******/

Ingredient.belongsToMany(Food, {
  through: {
    model: FoodComponent,
    unique: false,
    scope: {
      compositeFood: false
    }
  },
  foreignKey: 'componentId',
  constraints: false,
  as: 'components'
});
Food.belongsToMany(Ingredient, {
  through: {
    model: FoodComponent,
    unique: false,
    scope: {
      compositeFood: false
    }
  },
  foreignKey: 'foodId',
  constraints: false,
  as: 'ingredientFoods'
});

Food.hasMany(FoodComponent, {
  foreignKey: 'foodId',
  as: 'foodComponents',
  constraints: false,
});
FoodComponent.belongsTo(Food);
Ingredient.hasMany(FoodComponent, {
  foreignKey: 'componentId',
  as: 'ingredientFoods',
  constraints: false,
  scope: {
    compositeFood: false
  }
});


/*
* THIS below makes food_components table to have excessive field ingredient_id,
* Checked via sequelize.sync()
* It is a pity that belongsTo does not have 'sourceKey' option
*
// FoodComponent.belongsTo(Ingredient, { targetKey: 'id' });
*/


Food.belongsToMany(Food, {
  through: {
    model: FoodComponent,
    unique: false,
    scope: {
      compositeFood: true
    }
  },
  foreignKey: 'componentId',
  constraints: false,
  as: 'components'
});

Food.hasMany(FoodComponent, {
  foreignKey: 'componentId',
  as: 'compositeComponents',
  constraints: false,
  scope: {
    compositeFood: true
  }
});

/*****
* Food + Ingredient + Food table associations END
******/


/*****
* Facility + Address + Managers table associations BEGIN
******/

Address.hasOne(Facility, {
  foreignKey: 'addressId',
  as: 'facility_address'
});
Facility.belongsTo(Address);


Facility.belongsToMany(User, { through: FacilityManager });
User.belongsToMany(Facility, { through: FacilityManager });
Facility.hasMany(FacilityManager, {
  foreignKey: 'facilityId',
  as: 'facility_managers'
});
FacilityManager.belongsTo(Facility);
User.hasOne(FacilityManager, {
  foreignKey: 'userId',
  as: 'manager_facility'
});
FacilityManager.belongsTo(User);

/*****
* Facility + Address + Managers table associations END
******/


/*****
* Stock + Facility + Ingredient table associations BEGIN
******/

Ingredient.hasMany(Stock, {
  foreignKey: 'ingredientId',
  as: 'ingredient'
});
Stock.belongsTo(Ingredient);


Facility.hasMany(Stock, {
  foreignKey: 'facilityId',
  as: 'facility'
});
Stock.belongsTo(Facility);

/*****
* Stock + Facility + Ingredient table associations END
******/


/*****
* Order + Food table associations BEGIN
******/

Order.belongsToMany(Food, { through: OrderFood });
Food.belongsToMany(Order, { through: OrderFood });
Order.hasMany(OrderFood, {
  foreignKey: 'orderId',
  as: 'order_foods'
});
OrderFood.belongsTo(Order);
Food.hasMany(OrderFood, {
  foreignKey: 'orderId',
  as: 'food_orders'
});
OrderFood.belongsTo(Food);

/*****
* Order + Food table associations END
******/


export default {
  User,
  Session,
  Address,
  Food,
  Ingredient,
  Order,
  FoodComponent,
  OrderFood,
  UserAddress,
  FoodType,
  LocString,
  Facility,
  FacilityManager,
  Stock,
  DynamicModule
};