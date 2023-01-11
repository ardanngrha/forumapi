const LikeComment = require('../LikeComment');

describe('a LikeComment entities', () => {
  it('should throw error when owner is invalid', () => {
    const owner = '';
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    expect(() => new LikeComment(owner, threadId, commentId)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner did not meet data type specification', () => {
    // Arrange
    const owner = 123;
    const threadId = 'thread-123';
    const commentId = 'comment-123';

    // Action and Assert
    expect(() => new LikeComment(owner, threadId, commentId)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when threadId is invalid', () => {
    const owner = 'user-123';
    const threadId = '';
    const commentId = 'comment-123';

    expect(() => new LikeComment(owner, threadId, commentId)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when threadId did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 123;
    const commentId = 'comment-123';

    // Action and Assert
    expect(() => new LikeComment(owner, threadId, commentId)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when commentId is invalid', () => {
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = '';

    expect(() => new LikeComment(owner, threadId, commentId)).toThrowError('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when commentId did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const threadId = 'thread-123';
    const commentId = 123;

    // Action and Assert
    expect(() => new LikeComment(owner, threadId, commentId)).toThrowError('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create likeComment object correctly', () => {
    // Arrange
    const expectedOwner = 'user-123';
    const expectedThreadId = 'thread-123';
    const expectedCommentId = 'comment-123';

    // Action
    const {
      owner, threadId, commentId,
    } = new LikeComment(expectedOwner, expectedThreadId, expectedCommentId);

    // Assert
    expect(owner).toEqual(expectedOwner);
    expect(threadId).toEqual(expectedThreadId);
    expect(commentId).toEqual(expectedCommentId);
  });
});
