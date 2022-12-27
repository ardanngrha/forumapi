const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(owner, threadId, useCasePayload) {
    const comment = new AddComment(owner, threadId, useCasePayload);
    await this._threadRepository.isThreadExist(threadId);
    return this._commentRepository.addComment(comment);
  }
}

module.exports = AddCommentUseCase;
