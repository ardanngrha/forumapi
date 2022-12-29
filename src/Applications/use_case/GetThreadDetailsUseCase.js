const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');

class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const threadComments = await this._commentRepository.getThreadComments(threadId);
    threadComments.forEach((part, index, commentArrays) => {
      if (part.isDelete) {
        commentArrays[index].content = '**komentar telah dihapus**';
      }
      delete commentArrays[index].isDelete;
    });
    return new ThreadDetails({
      ...thread,
      comments: threadComments,
    });
  }
}

module.exports = GetThreadDetailsUseCase;
