import User from './User.js';
import Address from './Address.js';
import Food from './Food.js';
import Ingredient from './Ingredient.js';
import Order from './Order.js';
import FoodComponent from './FoodComponent.js';
import OrderFood from './OrderFood.js';
import UserAddress from './UserAddress.js';
import FoodType from './FoodType.js';
import LocString from './LocString.js';
import Facility from './Facility.js';
import FacilityManager from './FacilityManager.js';
import Stock from './Stock.js';
import DynamicModule from './DynamicModule.js';
import Picture from './Picture.js';
import FoodPicture from './FoodPicture.js';

/*****
 * User + Address table associations BEGIN
 ******/

User.belongsToMany(Address, { through: UserAddress });
Address.belongsToMany(User, { through: UserAddress });
User.hasMany(UserAddress, {
  foreignKey: 'userId',
  as: 'userAddresses'
});
UserAddress.belongsTo(User, { targetKey: 'id' });
Address.hasOne(UserAddress, {
  foreignKey: 'addressId',
  as: 'addressUser'
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
  as: 'moduleLocString'
});
DynamicModule.belongsTo(LocString, {
  foreignKey: 'locStringId',
  as: 'locString'
});

LocString.hasOne(Picture, {
  foreignKey: 'altTextLocId',
  as: 'pictureAltTextLoc'
});
Picture.belongsTo(LocString, {
  foreignKey: 'altTextLocId',
  as: 'altTextLoc'
});

/*****
 * Localization table associations END
 ******/


/*****
 * Food + FoodType table associations BEGIN
 ******/

FoodType.hasMany(Food, {
  foreignKey: 'foodTypeId',
  as: 'foodTypeFoods'
});
Food.belongsTo(FoodType, {
  foreignKey: 'foodTypeId',
  as: 'foodType'
});

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
FoodComponent.belongsTo(Food, {
  foreignKey: 'componentId',
  as: 'food',
  constraints: false,
  foreignKeyConstraint: false
});

Ingredient.hasMany(FoodComponent, {
  foreignKey: 'componentId',
  as: 'ingredientFoods',
  constraints: false,
  scope: {
    compositeFood: false
  }
});
FoodComponent.belongsTo(Ingredient, {
  foreignKey: 'componentId',
  as: 'ingredient',
  constraints: false,
  foreignKeyConstraint: false
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
  as: 'facilityAddress'
});
Facility.belongsTo(Address, {
  foreignKey: 'addressId',
  as: 'address'
});


Facility.belongsToMany(User, {
  through: FacilityManager,
  foreignKey: 'facilityId',
  as: 'managers'
});
// User.belongsToMany(Facility, {
//   through: FacilityManager,
//   foreignKey: 'userId',
//   as: 'manager'
// });
Facility.hasMany(FacilityManager, {
  foreignKey: 'facilityId',
  as: 'facilityManagers'
});
FacilityManager.belongsTo(Facility);
User.hasOne(FacilityManager, {
  foreignKey: 'userId',
  as: 'managerFacility'
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
  as: 'facilitiesStocks'
});
Stock.belongsTo(Ingredient, {
  foreignKey: 'ingredientId',
  as: 'ingredient'
});


Facility.hasMany(Stock, {
  foreignKey: 'facilityId',
  as: 'stocks'
});
Stock.belongsTo(Facility);

/*****
 * Stock + Facility + Ingredient table associations END
 ******/


/*****
 * Order + Food + Address + Facility table associations BEGIN
 ******/

Address.hasMany(Order, {
  foreignKey: 'addressId',
  as: 'orders'
});
Order.belongsTo(Address);

Facility.hasMany(Order, {
  foreignKey: 'facilityId',
  as: 'orders'
});
Order.belongsTo(Facility, {
  foreignKey: 'facilityId',
  as: 'facility'
});

Order.belongsToMany(Food, { through: OrderFood });
Food.belongsToMany(Order, { through: OrderFood });
Order.hasMany(OrderFood, {
  foreignKey: 'orderId',
  as: 'orderFoods'
});
OrderFood.belongsTo(Order);
Food.hasMany(OrderFood, {
  foreignKey: 'orderId',
  as: 'foodOrders'
});
OrderFood.belongsTo(Food);

/*****
 * Order + Food + Address + Facility table associations END
 ******/


/*****
 * DynamicModule + Picture table associations START
 ******/

Picture.hasOne(DynamicModule, {
  foreignKey: 'pictureId',
  as: 'pictureDynamicModule'
});
DynamicModule.belongsTo(Picture, {
  foreignKey: 'pictureId',
  as: 'picture'
});

/*****
 * DynamicModule + Picture table associations END
 ******/


/*****
 * Food + Picture table associations START
 ******/

Picture.belongsToMany(Food, { through: FoodPicture });
Food.belongsToMany(Picture, { through: FoodPicture });
Picture.hasMany(FoodPicture, {
  foreignKey: 'pictureId',
  as: 'pictureFoods'
});
FoodPicture.belongsTo(Picture);
Food.hasMany(FoodPicture, {
  foreignKey: 'foodId',
  as: 'gallery'
});
FoodPicture.belongsTo(Food);

/*****
 * Food + Picture table associations END
 ******/


export {
  User,
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
  DynamicModule,
  Picture,
  FoodPicture
};