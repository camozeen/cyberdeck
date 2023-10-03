import json

class TcpSocketResponse:
    def __init__(self, rawResponse, failed=False, message=None):
        self.rawResponse = rawResponse
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'tcp socket failure' if failed else 'tcp socket success'
