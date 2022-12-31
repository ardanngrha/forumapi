const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(owner, threadId, commentId, useCasePayload) {
    const reply = new AddReply(owner, commentId, useCasePayload);
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.isCommentExist(commentId);
    return this._replyRepository.addReply(reply);
  }
}

module.exports = AddReplyUseCase;
