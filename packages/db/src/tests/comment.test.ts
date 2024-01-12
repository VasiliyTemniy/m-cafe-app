import { expect } from 'chai';
import 'mocha';
import { dbHandler } from '../db';
import { randomEnumValue } from './db_test_helper';
import { UserRights } from '@m-market-app/shared-constants';
import { QueryTypes } from 'sequelize';



describe('Database Comment model tests', () => {

  const pickedCommentParentType = randomEnumValue('CommentParentType');

  before(async () => {
    await dbHandler.pingDb();
  });

  beforeEach(async () => {
    await dbHandler.models.Comment.destroy({ force: true, where: {} });
  });

  after(async () => {
    await dbHandler.models.Comment.destroy({ force: true, where: {} });
    await dbHandler.models.User.destroy({ force: true, where: {} });
  });

  it('Comment creation test', async () => {

    // Minimal data
    const comment = await dbHandler.models.Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1
    });

    expect(comment).to.exist;

    const user = await dbHandler.models.User.create({
      phonenumber: '123123123',
      lookupHash: 'testlonger',
      lookupNoise: 1,
      username: 'test',
      rights: UserRights.Customer
    });

    // Full data
    const comment2 = await dbHandler.models.Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1,
      userId: user.id,
      archiveUserName: user.username,
      blockedReason: 'no reason',
    });

    expect(comment2).to.exist;

  });

  it('Comment update test', async () => {

    const comment = await dbHandler.models.Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1
    });
    
    comment.orderNumber = 55;

    await comment.save();

    const commentInDB = await dbHandler.models.Comment.findByPk(comment.id);

    expect(commentInDB).to.exist;
    expect(commentInDB?.orderNumber).to.equal(55);

  });

  it('Comment delete test', async () => {

    const comment = await dbHandler.models.Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1
    });
    
    await comment.destroy();

    const commentInDB = await dbHandler.models.Comment.findByPk(comment.id);

    expect(commentInDB).to.not.exist;

  });

  it('Comment nested creation and associated retrieval test', async () => {

    const comment = await dbHandler.models.Comment.create({
      text: 'test',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1,
      parentCommentId: null
    });

    const nestedCommentOne = await dbHandler.models.Comment.create({
      text: 'testNestedOne',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1,
      parentCommentId: comment.id
    });

    const nestedCommentTwo = await dbHandler.models.Comment.create({
      text: 'testNestedTwo',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1,
      parentCommentId: comment.id
    });
    
    const deepNestedComment = await dbHandler.models.Comment.create({
      text: 'testDeepNested',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1,
      parentCommentId: nestedCommentOne.id
    });

    const anotherNotConnectedComment = await dbHandler.models.Comment.create({
      text: 'testAnotherNotConnected',
      parentId: 1, // does not exist
      parentType: pickedCommentParentType,
      orderNumber: 1,
      parentCommentId: null
    });
    
    const commentsInDB = await dbHandler.models.Comment.findAll({
      include: [
        {
          model: dbHandler.models.Comment,
          as: 'childComments',
        },
        {
          model: dbHandler.models.Comment,
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

    
    // Recursive query test

    const commentTree = await dbHandler.dbInstance?.query(`
      WITH RECURSIVE recursive_comments AS (
        SELECT
          id,
          parent_id,
          parent_type,
          order_number,
          parent_comment_id,
          1 AS nest_level
        FROM comments
        WHERE id = ${comment.id}

        UNION ALL

        SELECT
          comments.id,
          comments.parent_id,
          comments.parent_type,
          comments.order_number,
          comments.parent_comment_id,
          recursive_comments.nest_level + 1
        FROM comments
          JOIN recursive_comments
            ON recursive_comments.id = comments.parent_comment_id
      )
      SELECT * FROM recursive_comments
      ORDER BY
        nest_level ASC,
        order_number ASC;
    `, {
      type: QueryTypes.SELECT,
    }) as InstanceType<typeof dbHandler.models.Comment>[];

    expect(commentTree?.length).to.equal(4);

    const selectedIds = commentTree?.map(comment => comment.id);

    expect(selectedIds.includes(comment.id)).to.be.true;
    expect(selectedIds.includes(nestedCommentOne.id)).to.be.true;
    expect(selectedIds.includes(nestedCommentTwo.id)).to.be.true;
    expect(selectedIds.includes(deepNestedComment.id)).to.be.true;
    expect(selectedIds.includes(anotherNotConnectedComment.id)).to.be.false;


    const partialCommentTree = await dbHandler.dbInstance?.query(`
      WITH RECURSIVE recursive_comments AS (
        SELECT
          id,
          parent_id,
          parent_type,
          order_number,
          parent_comment_id,
          1 AS nest_level
        FROM comments
        WHERE id = ${nestedCommentOne.id}

        UNION ALL

        SELECT
          comments.id,
          comments.parent_id,
          comments.parent_type,
          comments.order_number,
          comments.parent_comment_id,
          recursive_comments.nest_level + 1
        FROM comments
          JOIN recursive_comments
            ON recursive_comments.id = comments.parent_comment_id
      )
      SELECT * FROM recursive_comments
      ORDER BY
        nest_level ASC,
        order_number ASC;
    `, {
      type: QueryTypes.SELECT
    }) as InstanceType<typeof dbHandler.models.Comment>[];

    expect(partialCommentTree?.length).to.equal(2);

    const selectedPartialIds = partialCommentTree?.map(comment => comment.id);

    expect(selectedPartialIds.includes(comment.id)).to.be.false;
    expect(selectedPartialIds.includes(nestedCommentOne.id)).to.be.true;
    expect(selectedPartialIds.includes(nestedCommentTwo.id)).to.be.false;
    expect(selectedPartialIds.includes(deepNestedComment.id)).to.be.true;
    expect(selectedPartialIds.includes(anotherNotConnectedComment.id)).to.be.false;

  });


});