const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(reply) {
    const {
      owner, threadId, commentId, content,
    } = reply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, threadId, commentId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedReply({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });
  }

  async verifyReplyOwner(owner, replyId) {
    const query = {
      text: 'SELECT owner FROM replies WHERE id = $1',
      values: [replyId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Balasan tidak ditemukan!');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini!');
    }
  }

  async deleteReply(replyId) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };

    await this._pool.query(query);
  }

  async getThreadReplies(threadId) {
    const query = {
      text: `SELECT replies.id, users.username, replies.date, replies.content, replies.comment_id, replies.is_delete
            FROM replies
            JOIN users ON replies.owner = users.id
            WHERE replies.thread_id = $1
            ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;
