class GetThreadDetailsUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    await this._threadRepository.isThreadExist(threadId);
    await this._commentRepository.getThreadById(threadId);
  }
}

module.exports = GetThreadDetailsUseCase;
