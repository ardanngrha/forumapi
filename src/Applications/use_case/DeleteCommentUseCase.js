class DeleteComentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId, commentId, owner) {
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.verifyCommentOwner(owner, commentId);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteComentUseCase;
