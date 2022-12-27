const AddThread = require('../AddThread');

describe('a AddThread entities', () => {
  it('should throw error when owner is invalid', () => {
    const owner = '';
    const payload = {
      title: 'This is a title',
      body: 'This is a body',
    };

    expect(() => new AddThread(owner, payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when owner did not meet data type specification', () => {
    // Arrange
    const owner = 123;
    const payload = {
      title: 'This is a title',
      body: 'This is a body',
    };

    // Action and Assert
    expect(() => new AddThread(owner, payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const owner = 'user-123';
    const payload = {
      title: 'This is a title',
    };

    // Action and Assert
    expect(() => new AddThread(owner, payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const owner = 'user-123';
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new AddThread(owner, payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correctly', () => {
    // Arrange
    const expectedOwner = 'user-123';
    const payload = {
      title: 'This is a title',
      body: 'This is a body',
    };

    // Action
    const { owner, title, body } = new AddThread(expectedOwner, payload);

    // Assert
    expect(owner).toEqual(expectedOwner);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
  });
});
