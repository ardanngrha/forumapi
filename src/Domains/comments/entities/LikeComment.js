class LikeComment {
  constructor(owner, threadId, commentId) {
    this._verifyParams(owner, threadId, commentId);

    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
  }

  _verifyParams(owner, threadId, commentId) {
    if (!owner || !threadId || !commentId) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeComment;
