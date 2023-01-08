class AddReply {
  constructor(owner, threadId, commentId, payload) {
    this._verifyParamsAndPayload(owner, threadId, commentId, payload);

    const { content } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.commentId = commentId;
    this.content = content;
  }

  _verifyParamsAndPayload(owner, threadId, commentId, { content }) {
    if (!owner || !threadId || !commentId || !content) {
      throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
