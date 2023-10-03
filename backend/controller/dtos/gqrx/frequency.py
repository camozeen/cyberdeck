import json

class GetFrequencyResponse:
    def __init__(self, hz, failed=False, message=None):
        self.hz = hz
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'fetch frequency failure' if failed else 'fetch frequency success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class SetFrequencyRequest:
    def __init__(self, hz, failed=False):
        self.hz = hz
        self.failed = failed

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class SetFrequencyResponse:
    def __init__(self, hz, failed=False, message=None):
        self.hz = hz
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'set frequency failure' if failed else 'set frequency success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

