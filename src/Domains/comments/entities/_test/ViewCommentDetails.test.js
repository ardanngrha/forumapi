const ViewCommentDetails = require('../ViewCommentDetails');

describe('a ViewCommentDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
    };

    // Action and Assert
    expect(() => new ViewCommentDetails(payload)).toThrowError('VIEW_COMMENT_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      content: {},
    };

    // Action and Assert
    expect(() => new ViewCommentDetails(payload)).toThrowError('VIEW_COMMENT_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create viewCommentDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      content: 'This is a comment',
    };

    // Action
    const comment = new ViewCommentDetails(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
  });
});
