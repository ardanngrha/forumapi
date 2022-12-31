const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a reply',
      };

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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });

      const requestAuthJSON = JSON.parse(requestAuth.payload);
      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ owner: id });

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toBeDefined();
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 401 unauthorized when user not login yet', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a reply',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 not found error when comment is not exist', async () => {
      // Arrange
      const requestPayload = {
        content: 'This is a comment',
      };

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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });

      const requestAuthJSON = JSON.parse(requestAuth.payload);
      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);
      await ThreadsTableTestHelper.addThread({ owner: id });

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan!');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        content: '',
      };

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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });
      const requestAuthJSON = JSON.parse(requestAuth.payload);
      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ owner: id });

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
        .toEqual('tidak dapat menambahkan balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });
      const requestAuthJSON = JSON.parse(requestAuth.payload);
      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ owner: id });

      // Action
      const response = await server.inject({
        method: 'POST',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads/thread-123/comments/comment-123/replies',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
        .toEqual('tidak dapat menambahkan balasan baru karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 and delete reply correctly', async () => {
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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });

      const requestAuthJSON = JSON.parse(requestAuth.payload);
      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);

      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ owner: id });
      await RepliesTableTestHelper.addReply({ owner: id });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 unauthorized when user not login yet', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when deleting a reply that are not created by the user', async () => {
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
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ owner: id });
      await RepliesTableTestHelper.addReply({ owner: id });

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'adann',
          password: 'secret',
          fullname: 'Fake Adan',
        },
      });

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adann',
          password: 'secret',
        },
      });

      const requestAuthJSON = JSON.parse(requestAuth.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak menghapus balasan ini!');
    });

    it('should response 404 not found error when comment is not exist', async () => {
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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });

      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);
      await ThreadsTableTestHelper.addThread({ owner: id });
      const requestAuthJSON = JSON.parse(requestAuth.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan!');
    });

    it('should response 404 not found error when reply is not exist', async () => {
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

      const requestAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'adanngrha',
          password: 'secret',
        },
      });

      const requestAuthJSON = JSON.parse(requestAuth.payload);
      const { data: { addedUser: { id } } } = JSON.parse(registeredUser.payload);
      await ThreadsTableTestHelper.addThread({ owner: id });
      await CommentsTableTestHelper.addComment({ owner: id });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123/replies/reply-123',
        headers: {
          Authorization: `Bearer ${requestAuthJSON.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Balasan tidak ditemukan!');
    });
  });
});
