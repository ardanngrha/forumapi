const ThreadDetails = require('../ThreadDetails');

describe('a ThreadDetails entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'This is a title',
      body: 'This is a body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'This is a title',
      body: 'This is a body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
      comments: {},
    };

    // Action and Assert
    expect(() => new ThreadDetails(payload)).toThrowError('THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'This is a title',
      body: 'This is a body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
      comments: [],
    };

    // Action
    const thread = new ThreadDetails(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
  });
});
