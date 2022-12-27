const DeleteComment = require('../DeleteComment');

describe('a deleteComment entities', () => {
  it('should create addComment object correctly', () => {
    // Arrange
    const expectedThreadId = 'thread-123';
    const expectedCommentId = 'comment-123';
    const expectedOwner = 'user-123';

    // Action
    const {
      threadId, commentId, owner } = new DeleteComment(expectedThreadId, expectedCommentId, expectedOwner);

    // Assert
    expect(threadId).toEqual(expectedThreadId);
    expect(commentId).toEqual(expectedCommentId);
    expect(owner).toEqual(expectedOwner);
  });
});
