const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/GetThreadDetailsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const { id: owner } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute(owner, request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsHandler(request) {
    const getThreadDetailsUseCase = this._container.getInstance(GetThreadDetailsUseCase.name);
    const { threadId } = request.params;
    const thread = await getThreadDetailsUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
