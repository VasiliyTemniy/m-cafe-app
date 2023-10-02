import { mapToRedisStrings, parseRedisToDT, parseRedisToData, mapDataToTransit } from '../types/helpers';
import 'mocha';
import { expect } from 'chai';


describe('Type helpers tests: mapToRedisStrings', () => {

  it('should map object values to strings for Redis', () => {
    const input = {
      name: 'John',
      age: 25,
      isActive: true,
      createdAt: new Date('2022-01-01'),
      family: 'Smith',
    };

    const expected = {
      name: 'John',
      age: '25',
      isActive: 'true',
      createdAt: '2022-01-01T00:00:00.000Z',
      family: 'Smith'
    };

    const result = mapToRedisStrings(input);
    expect(result).to.deep.equal(expected);
  });

  it('should omit specified properties', () => {
    const input = {
      name: 'John',
      age: 25,
      isActive: true,
      createdAt: new Date('2022-01-01'),
      address: {
        street: '123 Main St',
        city: 'New York',
      },
    };

    const omitProps = { omit: ['age', 'address'] };
    const expected = {
      name: 'John',
      isActive: 'true',
      createdAt: '2022-01-01T00:00:00.000Z',
    };

    const result = mapToRedisStrings(input, omitProps);
    expect(result).to.deep.equal(expected);
  });

  it('should throw an error when trying to convert a nested object', () => {
    const input = {
      name: 'John',
      age: 25,
      isActive: true,
      createdAt: new Date('2022-01-01'),
      address: {
        street: '123 Main St',
        city: 'New York',
      },
    };

    expect(() => {
      mapToRedisStrings(input);
    }).to.throw('dataToStrings function is used to convert nested object! Check implementations');
  });
});

describe('Type helpers tests: parseRedisToData', () => {

  it('should parse Redis strings to data fields correctly', () => {
    // Test case 1: Number conversion
    const data1 = parseRedisToData({ foo: '123', bar: '456' });
    expect(data1.foo).to.equal(123);
    expect(data1.bar).to.equal(456);

    // Test case 2: Date conversion
    const data2 = parseRedisToData({ date: '2022-01-01T00:00:00Z' });
    expect(data2.date).to.deep.equal(new Date('2022-01-01T00:00:00Z'));

    // Test case 3: Boolean conversion
    const data3 = parseRedisToData({ bool1: 'true', bool2: 'false' });
    expect(data3.bool1).to.equal(true);
    expect(data3.bool2).to.equal(false);

    // Test case 4: String conversion
    const data4 = parseRedisToData({ str: 'hello' });
    expect(data4.str).to.equal('hello');
  });
});

describe('Type helpers tests: parseRedisToDT', () => {

  it('should convert numbers as strings to numbers', () => {
    const dataObjStrings = {
      id: '1',
      price: '9.99',
      quantity: '10',
    };

    const expected = {
      id: 1,
      price: 9.99,
      quantity: 10,
    };

    const result = parseRedisToDT(dataObjStrings);
    expect(result).to.deep.equal(expected);
  });

  it("should convert 'true' and 'false' strings to booleans", () => {
    const dataObjStrings = {
      isAvailable: 'true',
      isActive: 'false',
    };

    const expected = {
      isAvailable: true,
      isActive: false,
    };

    const result = parseRedisToDT(dataObjStrings);
    expect(result).to.deep.equal(expected);
  });

  it('should leave other strings as they are if they are not numbers', () => {
    const dataObjStrings = {
      name: 'John Doe',
      age: '30',
    };

    const expected = {
      name: 'John Doe',
      age: 30,
    };

    const result = parseRedisToDT(dataObjStrings);
    expect(result).to.deep.equal(expected);
  });
});

describe('Type helpers tests: mapDataToTransit', () => {

  it('should map object values to transit data', () => {

    const date = new Date();

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date,
      updatedAt: date,
      isActive: true
    };

    const expected = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      isActive: true
    };

    const result = mapDataToTransit(data);

    expect(result).to.deep.equal(expected);
  });

  it('should omit foreign keys if includeForeignKeys is not set', () => {
    
    const data = {
      id: 1,
      addressId: 12345,
      vasyaId: 12345,
      name: 'John',
    };

    const expected = {
      id: 1,
      name: 'John',
    };

    const result = mapDataToTransit(data);

    expect(result).to.deep.equal(expected);
  });

  it('should omit specified properties', () => {

    const date = new Date();

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date,
      updatedAt: date,
      addressId: 12345
    };

    const omitProps = { omit: ['name', 'age', 'createdAt', 'addressId'] };

    const expected = {
      id: 1,
      updatedAt: date.toISOString()
    };

    const result = mapDataToTransit(data, omitProps);

    expect(result).to.deep.equal(expected);
  });

  it('should not omit timestamps if omitTimestamps is set to false', () => {

    const date = new Date();

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date,
      updatedAt: date
    };

    const omitProps = { omitTimestamps: false };

    const expected = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
    };

    const result = mapDataToTransit(data, omitProps);

    expect(result).to.deep.equal(expected);
  });

  it('should omit specified properties and timestamps', () => {

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const omitProps = { omit: ['name', 'age'], omitTimestamps: true };

    const expected = {
      id: 1
    };

    const result = mapDataToTransit(data, omitProps);

    expect(result).to.deep.equal(expected);
  });

  it('should ignore properties with null or undefined values', () => {

    const date = new Date();

    const data = {
      id: 1,
      name: null,
      age: undefined,
      createdAt: date,
      updatedAt: date
    };

    const expected = {
      id: 1,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString()
    };

    const result = mapDataToTransit(data);

    expect(result).to.deep.equal(expected);
  });

  it('should convert date objects to ISO strings', () => {

    const date = new Date();

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date,
      updatedAt: date,
      addressId: 12345
    };

    const expected = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };

    const result = mapDataToTransit(data);

    expect(result).to.deep.equal(expected);
  });

  it('should continue and ingnore properties that are nested objects', () => {

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      addressId: 12345,
      address: {
        street: '123 Main St',
        city: 'New York',
      }
    };

    const expected = {
      id: 1
    };

    const result = mapDataToTransit(data, {
      omit: ['name', 'age'],
      omitTimestamps: true
    });

    expect(result).to.deep.equal(expected);
    
  });

  it('should include foreign keys if includeForeignKeys is set to true', () => {

    const data = {
      id: 1,
      name: 'John',
      age: 25,
      createdAt: new Date(),
      updatedAt: new Date(),
      addressId: 12345
    };

    const expected = {
      id: 1,
      addressId: 12345
    };

    const result = mapDataToTransit(data, {
      omit: ['name', 'age'],
      omitTimestamps: true,
      includeForeignKeys: true
    });

    expect(result).to.deep.equal(expected);
    
  });

});
   