/* eslint-disable no-param-reassign */
const ThreadDetails = require('../../Domains/threads/entities/ThreadDetails');
const CommentDetails = require('../../Domains/comments/entities/CommentDetails');
const ReplyDetails = require('../../Domains/replies/entities/ReplyDetails');

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

    threadReplies.forEach((reply) => {
      if (reply.is_delete === true) {
        reply.content = '**balasan telah dihapus**';
      }
      delete reply.is_delete;
    });

    const commentsRepliesById = threadComments.map((data) => {
      const replies = threadReplies.filter((reply) => reply.comment_id === data.id)
        .map((reply) => (new ReplyDetails({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        })));

      return new CommentDetails({
        ...data,
        replies,
      });
    });

    return new ThreadDetails({
      ...thread,
      comments: commentsRepliesById,
    });
  }
}

module.exports = GetThreadDetailsUseCase;
