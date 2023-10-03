import json

class ConnectResponse:
    def __init__(self, failed=False):
        self.failed = failed
        self.message = 'connection failure' if failed else 'connection success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class CloseResponse:
    def __init__(self, failed=False):
        self.failed = failed
        self.message = 'close connection failure' if failed else 'close connection success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

