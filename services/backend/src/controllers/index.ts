import {
  UiSettingControllerExpressHttp,
  UiSettingRepoSequelizePG,
  UiSettingService,
  UserControllerExpressHttp,
  UserService,
  UserRepoSequelizePG,
  UiSettingRepoRedis,
  redisUiSettingsClient,
  FixedLocService,
  FixedLocRepoSequelizePG,
  FixedLocRepoRedis,
  redisFixedLocsClient,
  AddressRepoSequelizePG,
  SessionService,
  SessionRepoRedis,
  redisSessionClient,
  AuthController,
  AuthConnectionHandler,
  AuthServiceInternal,
  FoodTypeService,
  FoodTypeRepoSequelizePG,
  FoodService,
  FoodRepoSequelizePG,
  FoodPictureRepoSequelizePG,
  PictureService,
  PictureRepoSequelizePG,
  FoodComponentService,
  FoodComponentRepoSequelizePG,
  IngredientRepoSequelizePG,
  IngredientService,
  FacilityService,
  FacilityRepoSequelizePG,
  StockRepoSequelizePG,
  OrderService,
  OrderRepoSequelizePG,
  OrderFoodRepoSequelizePG,
  DynamicModuleService,
  DynamicModuleRepoSequelizePG,
  FixedLocControllerExpressHttp,
  FoodTypeControllerExpressHttp,
  FoodControllerExpressHttp,
  PictureControllerExpressHttp,
  FoodComponentControllerExpressHttp,
  IngredientControllerExpressHttp,
  FacilityControllerExpressHttp,
  OrderControllerExpressHttp,
  DynamicModuleControllerExpressHttp
} from '@m-cafe-app/backend-logic';
import {
  dbHandler
} from '@m-cafe-app/db';
import { TransactionHandlerSequelizePG } from '@m-cafe-app/backend-logic/build/utils';
import { LocStringRepoSequelizePG } from '@m-cafe-app/backend-logic/build/models/LocString';
import config from '@m-cafe-app/backend-logic';
import multer from 'multer';


// Init services


// This is necessary to create TransactionHandlers
await dbHandler.connect();


export const uiSettingService = new UiSettingService(
  new UiSettingRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  ),
  new UiSettingRepoRedis(redisUiSettingsClient)
);

export const fixedLocService = new FixedLocService(
  new FixedLocRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  ),
  new FixedLocRepoRedis(redisFixedLocsClient)
);

export const sessionService = new SessionService(
  new SessionRepoRedis(redisSessionClient)
);

export const authController = new AuthController(
  new AuthConnectionHandler(
    config.authUrl,
    config.authGrpcCredentials
  ),
  new AuthServiceInternal()
);

export const userService = new UserService(
  new UserRepoSequelizePG(),
  new AddressRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  ),
  sessionService,
  authController
);

export const foodTypeService = new FoodTypeService(
  new FoodTypeRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../public/multerTemp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png');
  }
});

export const pictureService = new PictureService(
  new PictureRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  ),
  'public/pictures/food',
  'public/pictures/modules',
  'public/multerTemp',
  multerStorage
);

export const foodService = new FoodService(
  new FoodRepoSequelizePG(),
  new FoodTypeRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  new FoodPictureRepoSequelizePG(),
  pictureService,
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);

export const foodComponentService = new FoodComponentService(
  new FoodComponentRepoSequelizePG(),
  new FoodRepoSequelizePG(),
  new IngredientRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);

export const ingredientService = new IngredientService(
  new IngredientRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);

export const facilityService = new FacilityService(
  new FacilityRepoSequelizePG(),
  new StockRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  new AddressRepoSequelizePG(),
  new UserRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);

export const orderService = new OrderService(
  new OrderRepoSequelizePG(),
  new OrderFoodRepoSequelizePG(),
  new FoodRepoSequelizePG(),
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);

export const dynamicModuleService = new DynamicModuleService(
  new DynamicModuleRepoSequelizePG(),
  new LocStringRepoSequelizePG(),
  pictureService,
  new TransactionHandlerSequelizePG(
    dbHandler
  )
);



// Init controllers


export const uiSettingController = new UiSettingControllerExpressHttp(
  uiSettingService
);

export const fixedLocController = new FixedLocControllerExpressHttp(
  fixedLocService
);

export const userController = new UserControllerExpressHttp(
  userService
);

export const foodTypeController = new FoodTypeControllerExpressHttp(
  foodTypeService
);

export const pictureController = new PictureControllerExpressHttp(
  pictureService
);

export const foodController = new FoodControllerExpressHttp(
  foodService
);

export const foodComponentController = new FoodComponentControllerExpressHttp(
  foodComponentService
);

export const ingredientController = new IngredientControllerExpressHttp(
  ingredientService
);

export const facilityController = new FacilityControllerExpressHttp(
  facilityService
);

export const orderController = new OrderControllerExpressHttp(
  orderService,
  userService,
  facilityService
);

export const dynamicModuleController = new DynamicModuleControllerExpressHttp(
  dynamicModuleService
);