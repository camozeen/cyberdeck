import json

class StartRecordingResponse:
    def __init__(self, failed=False, message=None):
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'failed to start recording' if failed else 'recording started'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class StopRecordingResponse:
    def __init__(self, failed=False, message=None):
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'failed to stop recording' if failed else 'recording stopped'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)
