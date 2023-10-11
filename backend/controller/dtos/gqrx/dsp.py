import json

class GetDspStateResponse:
    def __init__(self, is_on, failed=False, message=None):
        self.is_on = is_on
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'fetch dsp state failure' if failed else 'fetch dsp state success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class SetDspStateRequest:
    def __init__(self, flag, failed=False):
        self.flag = flag
        self.failed = failed

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class SetDspStateResponse:
    def __init__(self, flag, failed=False, message=None):
        self.flag = flag
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'set dsp state failure' if failed else 'set dsp success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

