const ViewThreadDetails = require('../ViewThreadDetails');

describe('a ViewThreadDetails entities', () => {
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
    expect(() => new ViewThreadDetails(payload)).toThrowError('VIEW_THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
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
    expect(() => new ViewThreadDetails(payload)).toThrowError('VIEW_THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create viewThreadDetails object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'This is a title',
      body: 'This is a body',
      date: '2021-08-08T07:19:09.775Z',
      username: 'user-123',
      comments: [
        {
          id: 'comment-_pby2_tmXV6bcvcdev8xk',
          username: 'johndoe',
          date: '2021-08-08T07:22:33.555Z',
          content: 'sebuah comment',
        },
        {
          id: 'comment-yksuCoxM2s4MMrZJO-qVD',
          username: 'dicoding',
          date: '2021-08-08T07:26:21.338Z',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    // Action
    const thread = new ViewThreadDetails(payload);

    // Assert
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.username).toEqual(payload.username);
    expect(thread.comments).toEqual(payload.comments);
  });
});
