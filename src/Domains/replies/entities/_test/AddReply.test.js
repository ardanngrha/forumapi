const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when owner is invalid', () => {
    const owner = '';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'This is a content',
    };

    expect(() => new AddReply(owner, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner did not meet data type specification', () => {
    // Arrange
    const owner = 123;
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 'This is a content',
    };

    // Action and Assert
    expect(() => new AddReply(owner, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when thread or comment is invalid', () => {
    const owner = 'user-123';
    const threadId = '-123';
    const commentId = '';
    const payload = {
      content: 'This is a content',
    };

    expect(() => new AddReply(owner, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when thread or comment did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 123;
    const commentId = 123;
    const payload = {
      content: 'This is a content',
    };

    // Action and Assert
    expect(() => new AddReply(owner, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: '',
    };

    // Action and Assert
    expect(() => new AddReply(owner, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddReply(owner, threadId, commentId, payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addReply object correctly', () => {
    // Arrange
    const expectedOwner = 'user-123';
    const expectedthreadId = 'thread-123';
    const expectedCommentId = 'comment-123';
    const payload = {
      content: 'This is a content',
    };

    // Action
    const {
      owner, threadId, commentId, content,
    } = new AddReply(expectedOwner, expectedthreadId, expectedCommentId, payload);

    // Assert
    expect(owner).toEqual(expectedOwner);
    expect(threadId).toEqual(expectedthreadId);
    expect(commentId).toEqual(expectedCommentId);
    expect(content).toEqual(payload.content);
  });
});
