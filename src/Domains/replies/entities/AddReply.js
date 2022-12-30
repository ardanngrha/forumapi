class AddReply {
  constructor(owner, commentId, payload) {
    this._verifyOwner(owner);
    this._verifyCommentId(commentId);
    this._verifyPayload(payload);

    const { content } = payload;

    this.owner = owner;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyOwner(owner) {
    if (!owner) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyCommentId(commentId) {
    if (!commentId) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }

  _verifyPayload({ content }) {
    if (!content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
