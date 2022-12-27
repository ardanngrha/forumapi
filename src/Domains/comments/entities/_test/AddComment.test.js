const AddComment = require('../AddComment');

describe('a AddComment entities', () => {
  it('should throw error when owner is invalid', () => {
    const owner = '';
    const threadId = 'thread-123';
    const payload = {
      content: 'This is a content',
    };

    expect(() => new AddComment(owner, threadId, payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner did not meet data type specification', () => {
    // Arrange
    const owner = 123;
    const threadId = 'thread-123';
    const payload = {
      content: 'This is a content',
    };

    // Action and Assert
    expect(() => new AddComment(owner, threadId, payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId is invalid', () => {
    const owner = 'user-123';
    const threadId = '';
    const payload = {
      content: 'This is a content',
    };

    expect(() => new AddComment(owner, threadId, payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when thread did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 123;
    const payload = {
      content: 'This is a content',
    };

    // Action and Assert
    expect(() => new AddComment(owner, threadId, payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: '',
    };

    // Action and Assert
    expect(() => new AddComment(owner, threadId, payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const payload = {
      content: 123,
    };

    // Action and Assert
    expect(() => new AddComment(owner, threadId, payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const expectedOwner = 'user-123';
    const expectedThreadId = 'thread-123';
    const payload = {
      content: 'This is a content',
    };

    // Action
    const { owner, threadId, content } = new AddComment(expectedOwner, expectedThreadId, payload);

    // Assert
    expect(owner).toEqual(expectedOwner);
    expect(threadId).toEqual(expectedThreadId);
    expect(content).toEqual(payload.content);
  });
});
