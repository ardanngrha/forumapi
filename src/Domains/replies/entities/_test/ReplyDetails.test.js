const ReplyDetails = require('../ReplyDetails');

describe('a replyDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError('REPLY_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: {},
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      is_delete: 234,
    };

    // Action and Assert
    expect(() => new ReplyDetails(payload)).toThrowError('REPLY_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replyDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      content: 'This is a reply',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
    };

    // Action
    const reply = new ReplyDetails(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.username).toEqual(payload.username);
    expect(reply.date).toEqual(payload.date);
  });
});
