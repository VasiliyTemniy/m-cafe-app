import { expect } from 'chai';
import 'mocha';
import { Comment, User } from '../models';
import { dbHandler } from '../db';
import { NumericToCommentParentTypeMapping } from '@m-cafe-app/shared-constants';



describe('Database Comment model tests', () => {

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await Comment.destroy({ force: true, where: {} });
  });

  after(async () => {
    await Comment.destroy({ force: true, where: {} });
    await User.destroy({ force: true, where: {} });
  });

  it('Comment creation test', async () => {

    const randomParentType =
      NumericToCommentParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToCommentParentTypeMapping).length)];

    // Minimal data
    const comment = await Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1
    });

    expect(comment).to.exist;

    const user = await User.create({
      name: 'test',
      phonenumber: '123123123',
      lookupHash: 'testlonger',
      username: 'test',
      rights: 'customer'
    });

    // Full data
    const comment2 = await Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1,
      userId: user.id,
      archiveUserName: user.username,
    });

    expect(comment2).to.exist;

  });

  it('Comment update test', async () => {
    
    const randomParentType =
      NumericToCommentParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToCommentParentTypeMapping).length)];

    const comment = await Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1
    });
    
    comment.orderNumber = 55;

    await comment.save();

    const commentInDB = await Comment.findByPk(comment.id);

    expect(commentInDB).to.exist;
    expect(commentInDB?.orderNumber).to.equal(55);

  });

  it('Comment delete test', async () => {
    
    const randomParentType =
      NumericToCommentParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToCommentParentTypeMapping).length)];

    const comment = await Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1
    });
    
    await comment.destroy();

    const commentInDB = await Comment.findByPk(comment.id);

    expect(commentInDB).to.not.exist;

  });

  it('Comment nested creation and associated retrieval test', async () => {

    const randomParentType =
      NumericToCommentParentTypeMapping[Math.floor(Math.random() * Object.keys(NumericToCommentParentTypeMapping).length)];

    const comment = await Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1,
      parentCommentId: null
    });

    const nestedCommentOne = await Comment.create({
      text: 'testNestedOne',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1,
      parentCommentId: comment.id
    });

    const nestedCommentTwo = await Comment.create({
      text: 'testNestedTwo',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1,
      parentCommentId: comment.id
    });
    
    const deepNestedComment = await Comment.create({
      text: 'testDeepNested',
      parentId: 1, // does not exist
      parentType: randomParentType,
      orderNumber: 1,
      parentCommentId: nestedCommentOne.id
    });
    
    const commentsInDB = await Comment.findAll({
      include: [
        {
          model: Comment,
          as: 'childComments',
        },
        {
          model: Comment,
          as: 'parentComment',
        }
      ]
    });

    const foundComment = commentsInDB.find(commentInDB => commentInDB.id === comment.id);
    expect(foundComment).to.exist;
    expect(foundComment?.childComments?.length).to.equal(2);

    const foundNestedCommentOne
      = commentsInDB.find(commentInDB => commentInDB.id === nestedCommentOne.id);

    expect(foundNestedCommentOne).to.exist;
    expect(foundNestedCommentOne?.parentComment?.id).to.equal(comment.id);
    expect(foundNestedCommentOne?.childComments?.length).to.equal(1);
    expect(foundNestedCommentOne?.childComments?.[0].id).to.equal(deepNestedComment.id);

    const foundNestedCommentTwo
      = commentsInDB.find(commentInDB => commentInDB.id === nestedCommentTwo.id);

    expect(foundNestedCommentTwo).to.exist;
    expect(foundNestedCommentTwo?.parentComment?.id).to.equal(comment.id);
    expect(foundNestedCommentTwo?.childComments?.length).to.equal(0);

  });


});