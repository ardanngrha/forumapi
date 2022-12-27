/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async addComment(threadId, {
    id = 'comment-123', content = 'This is a comment', owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5)',
      values: [id, content, threadId, owner, date],
    };

    await pool.query(query);
  },

  async deleteComment(threadId, commentId, { content = '**komentar telah dihapus**' }) {
    const query = {
      text: 'UPDATE comments SET content = $1 WHERE id = $2 AND thread_id = $3',
      values: [content, commentId, threadId],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
