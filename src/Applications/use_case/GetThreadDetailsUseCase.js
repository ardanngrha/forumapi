/* eslint-disable no-param-reassign */
class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._commentRepository.getThreadComments(threadId);

    threadComments.forEach((comment) => {
      if (comment.is_delete === true) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
    });

    thread.comments = threadComments;

    return thread;
  }
}

module.exports = GetThreadDetailsUseCase;
