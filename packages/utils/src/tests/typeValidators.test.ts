import { isString, isNumber, checkProperties } from '../types/typeValidators';
import { expect } from 'chai';
import 'mocha';

describe('Type validators tests: checkProperties', () => {

  it('should return true if all properties are present and their values are valid', () => {
    const obj = {
      name: 'John',
      age: 25,
      hobbies: ['reading', 'running']
    };

    const result1 = checkProperties({ obj, properties: [
      'name'
    ], required: true, validator: isString });

    const result2 = checkProperties({ obj, properties: [
      'age'
    ], required: true, validator: isNumber });

    const result3 = checkProperties({ obj, properties: [
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

    const result = checkProperties({ obj, properties: [
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

    const result1 = checkProperties({ obj, properties: [
      'name', 'age'
    ], required: true, validator: isString });

    const result2 = checkProperties({ obj, properties: [
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

    const result = checkProperties({ obj, properties: [
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

    const result = checkProperties({ obj, properties: [
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
    
    const result = checkProperties({ obj, properties: [
      'hobbies'
    ], required: true, validator: isString, isArray: true });

    expect(result).to.equal(true);
  });
});