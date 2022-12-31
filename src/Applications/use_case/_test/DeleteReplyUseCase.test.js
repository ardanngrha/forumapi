const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCaseCommentId = 'comment-123';
    const useCaseReplyId = 'reply-123';
    const useCaseOwner = 'user-123';

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockCommentRepository.isCommentExist = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.verifyReplyOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());

    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const deleteReplyUseCase = new DeleteReplyUseCase({
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCaseCommentId, useCaseReplyId, useCaseOwner))
      .resolves.not.toThrowError();
    expect(mockCommentRepository.isCommentExist).toBeCalledWith(useCaseCommentId);
    expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith(useCaseOwner, useCaseReplyId);
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith(useCaseCommentId, useCaseReplyId, useCaseOwner);
  });
});
