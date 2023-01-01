/* eslint-disable no-param-reassign */
class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);
    const threadComments = await this._commentRepository.getThreadComments(threadId);
    const threadReplies = await this._replyRepository.getThreadReplies(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);

    threadComments.forEach((comment) => {
      if (comment.is_delete === true) {
        comment.content = '**komentar telah dihapus**';
      }
      delete comment.is_delete;
    });

    console.debug(threadReplies);

    threadReplies.forEach((reply) => {
      if (reply.is_delete === true) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
    });

    console.debug(threadReplies);

    const commentRepliesById = threadComments.map((data) => {
      const replies = threadReplies.filter((reply) => reply.comment_id === data.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        }));

      return {
        id: data.id,
        username: data.username,
        date: data.date,
        replies,
        content: data.content,
      };
    });

    thread.comments = commentRepliesById;
    console.debug(thread.comments[0].replies);
    return thread;
  }
}

module.exports = GetThreadDetailsUseCase;
