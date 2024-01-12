import { assert, expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { logger } from '@m-cafe-app/utils';
import { LocType } from '@m-cafe-app/shared-constants';

describe('Database Handler tests', () => {

  describe('initFixedEnums method tests', () => {

    beforeEach(async () => {
      await dbHandler.models.FixedEnum.destroy({ force: true, where: {} });
    });

    after(async () => {
      await dbHandler.models.FixedEnum.destroy({ force: true, where: {} });
    });

    it('should work without errors', async () => {
      
      try {
        await dbHandler.initFixedEnums();
      } catch (error) {
        logger.shout(error);
        expect(error).to.not.exist;
      }

    });

    it('should throw error on key-value mismatch', async () => {
      
      const pickedEnumName = 'LocType';
      const nonNumericKeys = Object.keys(LocType).filter(key => isNaN(Number(key)));
      const pickedNonNumericKey = nonNumericKeys[Math.floor(Math.random() * nonNumericKeys.length)];
      const erroneousValue = 'ThisValueMustNeverBeInTheseEnums';

      const erroneousFixedEnum = await dbHandler.models.FixedEnum.create({
        name: pickedEnumName,
        key: String(pickedNonNumericKey),
        value: erroneousValue
      });

      try {
        await dbHandler.initFixedEnums();
      } catch (error) {
        expect(error).to.exist;
        if (!(error instanceof Error)) {
          assert.fail('Error is not an instance of Error');
        }
        expect(error.name).to.equal('DatabaseEnumError');
        expect(error.message).to.equal(`${pickedEnumName} enum value mismatch: ${erroneousFixedEnum?.value} !== ${LocType[pickedNonNumericKey as keyof typeof LocType]}`);
      }

    });

    it('should not throw error on new key-value pair appearence', async () => {
      
      const pickedEnumName = 'LocType';

      await dbHandler.initFixedEnums();

      try {
        await dbHandler.models.FixedEnum.create({
          name: pickedEnumName,
          key: '100500', // imitates numeric key
          value: 'SomeNewLocType'
        });

        await dbHandler.models.FixedEnum.create({
          name: pickedEnumName,
          key: 'SomeNewLocType',
          value: '100500' // imitates numeric key
        });
      } catch (error) {
        logger.shout(error);
        expect(error).to.not.exist;
      }

    });

  });

});