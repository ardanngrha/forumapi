const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist add comment and return registered user correctly', async () => {
      // Arrange
      const addComment = new AddComment('user-123', 'thread-123', {
        content: 'This is a comment',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment('user-123', 'thread-123', {
        content: 'This is a comment',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepository.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyOwner function', () => {
    it('should verify comment owner correctly when owner and commentId matched', async () => {
      // Arrange
      const owner = 'user-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adanngrha',
        password: 'secret',
        fullname: 'Adan Nugraha',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'This is a title',
        body: 'This is a body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment('thread-123', {
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner(owner, commentId))
        .resolves.not.toThrow(InvariantError);
    });

    it('should throw authorization error when owner and commentId did not matched', async () => {
      // Arrange
      const owner = 'user-321';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adanngrha',
        password: 'secret',
        fullname: 'Adan Nugraha',
      });

      await UsersTableTestHelper.addUser({
        id: 'user-321',
        username: 'adann',
        password: 'secret',
        fullname: 'Adan 123',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'This is a title',
        body: 'This is a body',
        owner: 'user-123',
      });

      await CommentsTableTestHelper.addComment('thread-123', {
        id: 'comment-123',
        content: 'This is a comment',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner(owner, commentId))
        .rejects.toThrow(AuthorizationError);
    });

    it('should throw not found error when a comment with given id not found', async () => {
      // Arrange
      const owner = 'user-123';
      const commentId = 'comment-123';

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'adanngrha',
        password: 'secret',
        fullname: 'Adan Nugraha',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'This is a title',
        body: 'This is a body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner(commentId, owner))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-123';
      const owner = 'user-123';

      await UsersTableTestHelper.addUser({ id: owner });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      await CommentsTableTestHelper.addComment(threadId, { commentId });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepository.deleteComment(threadId, commentId, owner);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment[0].is_delete).toBeTruthy();
    });
  });

  describe('isCommentExist function', () => {
    it('should throw not found error when a comment with given id not found', async () => {
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await expect(commentRepository.isCommentExist(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw error when a thread with given id is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const comment = new AddComment('user-123', 'thread-123', { content: 'This is a content' });

      const fakeIdGenerator = () => '123';
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepository.addComment(comment);
      await expect(commentRepository.isCommentExist('comment-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadComments function', () => {
    it('should return thread comments correctly', async () => {
      // Arrange

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ owner: 'user-123' });
      await CommentsTableTestHelper.addComment('thread-123', { id: 'comment-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const commentRepository = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const commentDetails = await commentRepository.getThreadComments('thread-123');

      // Assert
      expect(commentDetails).toHaveLength(1);
      expect(commentDetails[0]).toHaveProperty('id', 'comment-123');
      expect(commentDetails[0]).toHaveProperty('content', 'This is a comment');
      expect(commentDetails[0]).toHaveProperty('username', 'adanngrha');
      expect(commentDetails[0]).toHaveProperty('date');
      expect(commentDetails[0]).toHaveProperty('is_delete');
    });
  });
});
