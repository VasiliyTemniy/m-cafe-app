import type { PropertyGroup } from '../types/typeValidators';
import { isString, isNumber, checkProperties, isEntity, isBoolean, isDate, isEnum } from '../types/typeValidators';
import { expect } from 'chai';
import 'mocha';

describe('Type validators tests: checkProperties', () => {

  it('should return true if all properties are present and their values are valid', () => {
    const obj = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running']
    };

    const { result: result1 } = checkProperties({ obj, properties: [
      'name'
    ], required: true, validator: isString });

    const { result: result2 } = checkProperties({ obj, properties: [
      'age'
    ], required: true, validator: isNumber });

    const { result: result3 } = checkProperties({ obj, properties: [
      'hobbies'
    ], required: true, validator: isString, isArray: true });

    expect(result1).to.equal(true);
    expect(result2).to.equal(true);
    expect(result3).to.equal(true);
  });

  it('should return false if any property is missing', () => {
    const obj = {
      name: 'John',
      age: '25'
    };

    const { result } = checkProperties({ obj, properties: [
      'name', 'age', 'hobbies'
    ], required: true, validator: isString });

    expect(result).to.equal(false);
  });

  it('should return false if any property value is invalid', () => {
    const obj = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running']
    };

    const { result: result1 } = checkProperties({ obj, properties: [
      'name', 'age'
    ], required: true, validator: isString });

    const { result: result2 } = checkProperties({ obj, properties: [
      'hobbies'
    ], required: true, validator: isNumber, isArray: true });

    expect(result1).to.equal(false);
    expect(result2).to.equal(false);
  });

  it('should return true if some properties are missing but not required', () => {
    const obj = {
      name: 'John',
      age: '25',
      height: '180',
      weight: '80'
    };

    const { result } = checkProperties({ obj, properties: [
      'name', 'age', 'height', 'weight', 'hobbies', 'hobby', 'hobby2'
    ], required: false, validator: isString });

    expect(result).to.equal(true);
  });

  it('should return false if any property value in an array is invalid', () => {
    const obj = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running', 30]
    };

    const { result } = checkProperties({ obj, properties: [
      'hobbies'
    ], required: true, validator: isNumber, isArray: true });

    expect(result).to.equal(false);
  });

  it('should return true if all property values in an array are valid', () => {
    const obj = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running']
    };
    
    const { result } = checkProperties({ obj, properties: [
      'hobbies'
    ], required: true, validator: isString, isArray: true });

    expect(result).to.equal(true);
  });
});


describe('Type validators tests: isEntity', () => {

  it('should return true if all properties are present and valid', () => {
    const obj = {
      id: 1,
      name: 'John Doe',
      age: 30,
      married: true,
      hobbies: ['coding', 'reading'],
      createdAt: new Date('2022-01-01')
    };

    const propertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id', 'age'],
        validator: isNumber
      },
      {
        properties: ['hobbies'],
        validator: isString,
        isArray: true
      },
      {
        properties: ['married'],
        validator: isBoolean
      },
      {
        properties: ['createdAt'],
        validator: isDate
      }
    ];

    const result = isEntity(obj, propertiesGroups);
    expect(result).to.equal(true);
  });

  it('should return false if any required property is missing', () => {
    const obj = {
      id: 1,
      name: 'John Doe'
    };

    const propertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id', 'age'],
        validator: isNumber
      }
    ];

    const result = isEntity(obj, propertiesGroups);
    expect(result).to.equal(false);
  });

  it('should not return false if any optional property is missing', () => {
    const obj = {
      id: 1,
      name: 'John Doe'
    };

    const propertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id'],
        validator: isNumber
      },
      {
        properties: ['age'],
        required: false,
        validator: isNumber
      }
    ];

    const result = isEntity(obj, propertiesGroups);
    expect(result).to.equal(true);
  });

  it('should return false if any property is invalid', () => {
    // Test case 1: wrong type of required age property
    const obj1 = {
      id: 1,
      name: 'John Doe',
      age: '30'
    };
    
    const propertiesGroups1: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id', 'age'],
        validator: isNumber
      }
    ];

    const result1 = isEntity(obj1, propertiesGroups1);
    expect(result1).to.equal(false);

    // Test case 2: wrong type of optional age property
    const obj2 = {
      id: 1,
      name: 'John Doe',
      age: true
    };
    
    const propertiesGroups2: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id', 'age'],
        required: false,
        validator: isNumber
      }
    ];

    const result2 = isEntity(obj2, propertiesGroups2);
    expect(result2).to.equal(false);

  });

  it('should return true if array properties are valid', () => {
    const obj = {
      id: 1,
      name: 'John Doe',
      hobbies: ['coding', 'reading']
    };

    const propertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id'],
        validator: isNumber
      },
      {
        properties: ['hobbies'],
        validator: isString,
        isArray: true
      }
    ];

    const result = isEntity(obj, propertiesGroups);
    expect(result).to.equal(true);
  });

  it('should return false if array properties are invalid', () => {
    // Not is Array
    const obj1 = {
      id: 1,
      name: 'John Doe',
      hobbies: 'coding'
    };

    // Arrays with wrong typed items below
    const obj2 = {
      id: 1,
      name: 'John Doe',
      hobbies: [123, 456]
    };

    const obj3 = {
      id: 1,
      name: 'John Doe',
      hobbies: ['coding', 123]
    };

    const obj4 = {
      id: 1,
      name: 'John Doe',
      hobbies: ['coding', true, 123]
    };

    const obj5 = {
      id: 1,
      name: 'John Doe',
      hobbies: [true, false, true, 123]
    };

    const obj6 = {
      id: 1,
      name: 'John Doe',
      hobbies: [true, false]
    };

    const propertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id'],
        validator: isNumber
      },
      {
        properties: ['hobbies'],
        validator: isString,
        isArray: true
      }
    ];

    const result1 = isEntity(obj1, propertiesGroups);
    expect(result1).to.equal(false);

    const result2 = isEntity(obj2, propertiesGroups);
    expect(result2).to.equal(false);

    const result3 = isEntity(obj3, propertiesGroups);
    expect(result3).to.equal(false);

    const result4 = isEntity(obj4, propertiesGroups);
    expect(result4).to.equal(false);

    const result5 = isEntity(obj5, propertiesGroups);
    expect(result5).to.equal(false);

    const result6 = isEntity(obj6, propertiesGroups);
    expect(result6).to.equal(false);

  });

  it('should work for nested isEntity validators', () => {

    type User = {
      id: number;
      name: string;
      age: number;
      married: boolean;
      hobbies: string[];
      createdAt: Date;
    };

    type Car = {
      id: number;
      make: string;
      model: string;
      year: number;
    };

    type Address = {
      street: string;
      city: string;
      state: string;
      country: string;
    };

    type NestedObject = {
      user: User;
      car: Car;
      address: Address;
    };

    const obj: NestedObject = {
      user: {
        id: 1,
        name: 'John Doe',
        age: 30,
        married: true,
        hobbies: ['coding', 'reading'],
        createdAt: new Date('2022-01-01')
      },
      car: {
        id: 101,
        make: 'Toyota',
        model: 'Corolla',
        year: 2020
      },
      address: {
        street: 'Main Street',
        city: 'New York',
        state: 'NY',
        country: 'USA'
      }
    };

    const userPropertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id', 'age'],
        validator: isNumber
      },
      {
        properties: ['hobbies'],
        validator: isString,
        isArray: true
      },
      {
        properties: ['married'],
        validator: isBoolean
      },
      {
        properties: ['createdAt'],
        validator: isDate
      }
    ];

    const isUser = (obj: unknown): obj is User =>
      isEntity(obj, userPropertiesGroups);

    const carPropertiesGroups: PropertyGroup[] = [
      {
        properties: ['make', 'model'],
        validator: isString
      },
      {
        properties: ['id', 'year'],
        validator: isNumber
      }
    ];

    const isCar = (obj: unknown): obj is Car =>
      isEntity(obj, carPropertiesGroups);

    const addressPropertiesGroups: PropertyGroup[] = [
      {
        properties: ['street', 'city', 'state', 'country'],
        validator: isString
      }
    ];

    const isAddress = (obj: unknown): obj is Address =>
      isEntity(obj, addressPropertiesGroups);


    const nestedObjectPropertiesGroups: PropertyGroup[] = [
      {
        properties: ['user'],
        validator: isUser
      },
      {
        properties: ['car'],
        validator: isCar
      },
      {
        properties: ['address'],
        validator: isAddress
      }
    ];

    const result = isEntity(obj, nestedObjectPropertiesGroups);
    expect(result).to.equal(true);

  });

  it('should return false if object has any more properties than expected', () => {

    // Will help to omit precautious destructuring of incoming trasnit data in controllers - less boilerplate code
    
    const propertiesGroups: PropertyGroup[] = [
      {
        properties: ['name'],
        validator: isString
      },
      {
        properties: ['id'],
        validator: isNumber
      },
      {
        properties: ['hobbies'],
        validator: isString,
        isArray: true
      },
      {
        properties: ['married'],
        validator: isBoolean,
        required: false
      },
      {
        properties: ['address'],
        validator: isString,
        required: false
      }
    ];

    const objWithoutOptionalsWithUnexpected = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running'],
      license: '123456' // Has nothing to do with optionals or specified properties
    };

    const objWithOneOutOfTwoOptionalWithUnexpected = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running'],
      married: true, // optional
      children: '123456', // Has nothing to do with optionals or specified properties
    };

    const objWithAllOptionalsWithUnexpected = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running'],
      married: true, // optional
      address: 'Lenina st. 1', // optional
      children: '123456', // Has nothing to do with optionals or specified properties
    };

    const result1 = isEntity(objWithoutOptionalsWithUnexpected, propertiesGroups);
    expect(result1).to.equal(false);

    const result2 = isEntity(objWithOneOutOfTwoOptionalWithUnexpected, propertiesGroups);
    expect(result2).to.equal(false);

    const result3 = isEntity(objWithAllOptionalsWithUnexpected, propertiesGroups);
    expect(result3).to.equal(false);

  });

});

describe('Type validators tests: isEnum', () => {
  it('should return true if value is a valid enum value', () => {
    enum Colors {
      Red = 'RED',
      Blue = 'BLUE',
      Green = 'GREEN',
    }

    expect(isEnum(Colors.Red, Colors)).to.equal(true);
    expect(isEnum(Colors.Blue, Colors)).to.equal(true);
    expect(isEnum(Colors.Green, Colors)).to.equal(true);
    expect(isEnum('RED', Colors)).to.equal(true);
    expect(isEnum('BLUE', Colors)).to.equal(true);
    expect(isEnum('GREEN', Colors)).to.equal(true);
  });

  it('should return false if value is not a valid enum value', () => {
    enum Colors {
      Red = 'RED',
      Blue = 'BLUE',
      Green = 'GREEN',
    }

    expect(isEnum('YELLOW', Colors)).to.equal(false); // not a valid enum value
    expect(isEnum(123, Colors)).to.equal(false); // not a valid enum value
    expect(isEnum(null, Colors)).to.equal(false); // not a valid enum value
    expect(isEnum(undefined, Colors)).to.equal(false); // not a valid enum value
    expect(isEnum({}, Colors)).to.equal(false); // not a valid enum value
  });
});