const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(owner, useCasePayload) {
    const thread = new AddThread(owner, useCasePayload);
    return this._threadRepository.addThread(thread);
  }
}

module.exports = AddThreadUseCase;
