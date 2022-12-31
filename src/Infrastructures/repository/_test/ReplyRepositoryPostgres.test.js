const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should return added reply correctly', async () => {
      // Arrange
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ owner });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner });

      const reply = new AddReply(owner, 'comment-123', {
        content: 'This is a reply',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepository.addReply(reply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'This is a reply',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyOwner function', () => {
    it('should verify reply owner correctly when owner and replyId matched', async () => {
      // Arrange
      const owner = 'user-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ owner });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', owner });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepository.verifyReplyOwner(owner, replyId))
        .resolves.not.toThrow(InvariantError);
    });

    it('should throw authorization error when owner and reply did not matched', async () => {
      // Arrange
      const owner = 'user-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await UsersTableTestHelper.addUser({ id: 'user-321', username: 'adann' });
      await ThreadsTableTestHelper.addThread({ owner });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner });
      await RepliesTableTestHelper.addReply({ commentId: 'comment-123', owner });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepository.verifyReplyOwner('user-321', replyId))
        .rejects.toThrow(AuthorizationError);
    });

    it('should throw not found error when a reply with given id not found', async () => {
      // Arrange
      const owner = 'user-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ owner });
      await CommentsTableTestHelper.addComment({ threadId: 'thread-123', owner });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepository.verifyReplyOwner(owner, replyId))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';
      const replyId = 'reply-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ owner });
      await CommentsTableTestHelper.addComment({ threadId, owner });
      await RepliesTableTestHelper.addReply({ commentId, owner });

      const fakeIdGenerator = () => '123'; // stub!
      const replyRepository = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepository.deleteReply(replyId, commentId, owner);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById(replyId);
      expect(reply[0].is_delete).toBeTruthy();
    });
  });
});