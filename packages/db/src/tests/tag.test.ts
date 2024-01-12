import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';



describe('Database Tag model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.Tag.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Tag.destroy({ force: true, where: {} });
  });

  it('Tag creation test', async () => {

    // declare approvedBy: ForeignKey<User['id']> | null;
    // declare name: string;

    const tag = await dbHandler.models.Tag.create({
      approvedBy: null,
      name: 'test'
    });

    expect(tag).to.exist;

  });

  it('Tag update test', async () => {
    
    const tag = await dbHandler.models.Tag.create({
      approvedBy: null,
      name: 'test'
    });

    tag.name = 'test2';

    await tag.save();

    const tagInDB = await dbHandler.models.Tag.findOne({ where: {
      id: tag.id
    } });

    expect(tagInDB).to.exist;
    expect(tagInDB?.name).to.equal('test2');

  });

  it('Tag delete test', async () => {
    
    const tag = await dbHandler.models.Tag.create({
      approvedBy: null,
      name: 'test'
    });

    await tag.destroy();

    const tagInDB = await dbHandler.models.Tag.findOne({ where: {
      id: tag.id
    } });

    expect(tagInDB).to.not.exist;

  });

});