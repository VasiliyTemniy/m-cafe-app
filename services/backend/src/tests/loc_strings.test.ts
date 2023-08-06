import { expect } from "chai";
import "mocha";
import { connectToDatabase } from "../utils/db";
import { LocString } from '../models';
import { NewLocString } from "@m-cafe-app/utils";



await connectToDatabase();


describe('Localization strings', () => {

  it('Localization strings can be created, updated, deleted', async () => {

    const locString: NewLocString = {
      ruString: 'Превед!',
      enString: 'Hallo!',
      altString: 'Bon giorno!'
    };

    await LocString.create(locString);

    const savedLocStrings = await LocString.findAll({});

    expect(savedLocStrings).to.be.lengthOf(1);
    expect(savedLocStrings[0].ruString).to.equal(locString.ruString);

    const locStringInDB = savedLocStrings[0];

    const updatedRuString = 'Давай, до свидания!';
    locStringInDB.ruString = updatedRuString;

    await locStringInDB.save();

    const updatedLocStrings = await LocString.findAll({});

    expect(updatedLocStrings).to.be.lengthOf(1);
    expect(updatedLocStrings[0].ruString).to.equal(updatedRuString);

    const updatedLocString = updatedLocStrings[0];

    await updatedLocString.destroy();

    const locStringsAtEnd = await LocString.findAll({});

    expect(locStringsAtEnd).to.be.lengthOf(0);

  });

});