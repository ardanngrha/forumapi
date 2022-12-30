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
    const expectedComments = new CommentDetails({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:22:33.555Z',
      content: 'This is a comment',
    });

    const expectedThreadDetails = new ThreadDetails({
      id: 'thread-123',
      title: 'This is a title',
      body: 'This is a body',
      date: '2021-08-08T07:22:33.555Z',
      username: 'adanngrha',
      comments: [
        expectedComments,
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
        expectedComments,
      ]));
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThreadDetails));

    /** creating use case instance */
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetails = await getThreadDetailsUseCase.execute(useCaseThreadId);

    // Assert
    expect(threadDetails).toStrictEqual(expectedThreadDetails);
    expect(mockThreadRepository.isThreadExist).toBeCalledWith(useCaseThreadId);
    expect(mockCommentRepository.getThreadComments).toBeCalledWith(useCaseThreadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCaseThreadId);
  });
});
