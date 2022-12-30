const AddedComment = require('../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(comment) {
    const { owner, threadId, content } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);

    return new AddedComment({
      id: result.rows[0].id,
      content: result.rows[0].content,
      owner: result.rows[0].owner,
    });
  }

  async verifyCommentOwner(owner, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Komentar tidak ditemukan!');
    }
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus komentar ini!');
    }
  }

  async deleteComment(threadId, commentId, owner) {
    const query = {
      text: `UPDATE comments SET is_delete = true
      WHERE id = $1 AND thread_id = $2 AND owner = $3`,
      values: [commentId, threadId, owner],
    };

    await this._pool.query(query);
  }

  async getThreadComments(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete
            FROM comments
            JOIN users ON comments.owner = users.id
            WHERE comments.thread_id = $1
            ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;
