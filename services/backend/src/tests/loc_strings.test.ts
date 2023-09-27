import type { NewLocString } from '@m-cafe-app/utils';
import { expect } from 'chai';
import 'mocha';
import { connectToDatabase, LocString } from '@m-cafe-app/db';



await connectToDatabase();


describe('Localization strings', () => {

  it('Localization strings can be created, updated, deleted', async () => {

    await LocString.destroy({ where: {} });

    const locString: NewLocString = {
      mainStr: 'Превед!',
      secStr: 'Hallo!',
      altStr: 'Bon giorno!'
    };

    await LocString.create(locString);

    const savedLocStrings = await LocString.findAll({});

    expect(savedLocStrings).to.be.lengthOf(1);
    expect(savedLocStrings[0].mainStr).to.equal(locString.mainStr);

    const locStringInDB = savedLocStrings[0];

    const updatedRuString = 'Давай, до свидания!';
    locStringInDB.mainStr = updatedRuString;

    await locStringInDB.save();

    const updatedLocStrings = await LocString.findAll({});

    expect(updatedLocStrings).to.be.lengthOf(1);
    expect(updatedLocStrings[0].mainStr).to.equal(updatedRuString);

    const updatedLocString = updatedLocStrings[0];

    await updatedLocString.destroy();

    const locStringsAtEnd = await LocString.findAll({});

    expect(locStringsAtEnd).to.be.lengthOf(0);

  });

});