class AddComment {
  constructor(owner, threadId, payload) {
    this._verifyParamsAndPayload(owner, threadId, payload);

    const { content } = payload;

    this.owner = owner;
    this.threadId = threadId;
    this.content = content;
  }

  _verifyParamsAndPayload(owner, threadId, { content }) {
    if (!owner || !threadId || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof owner !== 'string' || typeof threadId !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
