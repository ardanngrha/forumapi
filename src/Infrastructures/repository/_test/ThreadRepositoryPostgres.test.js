const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('addThread function', () => {
    it('should persist add thread and return registered user correctly', async () => {
      // Arrange
      const addThread = new AddThread('user-123', {
        title: 'This is a title',
        body: 'This is a body',
      });

      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepository.addThread(addThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const addThread = new AddThread('user-123', {
        title: 'This is a title',
        body: 'This is a body',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'This is a title',
        owner: 'user-123',
      }));
    });
  });

  describe('isThreadExist function', () => {
    it('should throw not found error when a thread with given id not found', async () => {
      const threadId = 'thread-123';
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await expect(threadRepositoryPostgres.isThreadExist(threadId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw error when a thread with given id is found', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });

      const addThread = new AddThread('user-123', { title: 'This is a title', body: 'This is a body' });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);
      await expect(threadRepositoryPostgres.isThreadExist('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread details correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'adanngrha' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);

      // Action
      const threadDetails = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(threadDetails).toHaveProperty('id', 'thread-123');
      expect(threadDetails).toHaveProperty('title', 'This is a title');
      expect(threadDetails).toHaveProperty('body', 'This is a body');
      expect(threadDetails).toHaveProperty('date');
      expect(threadDetails).toHaveProperty('username', 'adanngrha');
    });
  });
});
