const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadDetails = require('../../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../../Domains/comments/entities/CommentDetails');

describe('GetThreadDetailsUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the get thread details action correctly', async () => {
    // Arrange
    const useCaseThreadId = 'thread-123';

    const expectedThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'This is a title',
      body: 'This is a body',
      date: '2022-05-18 20:05:10.376458',
      username: 'adanngrha',
      comments: [
        new CommentDetails({
          id: 'comment-123',
          username: 'dicoding',
          date: '2022-05-18 20:05:12.000967',
          content: 'This is a comment',
          is_delete: false,
        }),
      ],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.isThreadExist = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: '2022-05-18 20:05:12.000967',
          content: 'This is a comment',
          is_delete: false,
        },
      ]));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: 'thread-123',
        title: 'This is a title',
        body: 'This is a body',
        date: '2022-05-18 20:05:10.376458',
        username: 'adanngrha',
      }));

    /** creating use case instance */
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await expect(getThreadDetailsUseCase.execute(useCaseThreadId))
      .resolves.not.toThrowError();

    // Assert
    expect(thread).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCaseThreadId);
    expect(mockCommentRepository.getThreadComments).toBeCalledWith(useCaseThreadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseThreadId);
  });
});
