const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'This is a title',
        body: 'This is a body',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'adanngrha',
          password: 'secret',
          fullname: 'Adan Nugraha',
        },
      });

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });
      const requestAuthJSON = JSON.parse(requestAuth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toBeDefined();
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should throw an Unauthorized error with status code 401', async () => {
      // Arrange
      const requestPayload = {
        title: 'This is a title',
        body: 'This is a body',
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'This is a title',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'adanngrha',
          password: 'secret',
          fullname: 'Adan Nugraha',
        },
      });

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });
      const requestAuthJSON = JSON.parse(requestAuth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        title: 123,
        body: {},
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'adanngrha',
          password: 'secret',
          fullname: 'Adan Nugraha',
        },
      });

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });
      const requestAuthJSON = JSON.parse(requestAuth.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread details and deleted comments correctly', async () => {
      // Arrange
      const server = await createServer(container);

      const registeredUser = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'adanngrha',
          password: 'secret',
          fullname: 'Adan Nugraha',
        },
      });

      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);

      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: id });
      await CommentsTableTestHelper.addComment({ owner: id, threadId: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-222', owner: id, threadId: 'thread-123' });
      await CommentsTableTestHelper.deleteCommentById('comment-222');

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments[0]).toBeDefined();
      expect(responseJson.data.thread.comments[1].content).toEqual('**komentar telah dihapus**');
    });
  });
});
