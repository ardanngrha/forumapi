class DeleteReplyUseCase {
  constructor({ commentRepository, replyRepository }) {
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(commentId, replyId, owner) {
    await this._commentRepository.isCommentExist(commentId);
    await this._replyRepository.verifyReplyOwner(owner, replyId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
