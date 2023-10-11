import json

class GetModeResponse:
    def __init__(self, mode, passband_hz, failed=False, message=None):
        self.mode = mode
        self.passband_hz = passband_hz
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'fetch demod mode failure' if failed else 'fetch demod mode success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class SetModeRequest:
    def __init__(self, mode, passband_hz, failed=False):
        self.mode = mode
        self.passband_hz = passband_hz
        self.failed = failed

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class SetModeResponse:
    def __init__(self, mode, passband_hz, failed=False, message=None):
        self.mode = mode
        self.passband_hz = passband_hz
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'set demod mode failure' if failed else 'set demod mode success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class ListSupportedModesResponse:
    def __init__(self, modes, failed=False, message=None):
        self.modes = modes
        self.failed = failed
        if message is not None:
            self.message = message
        else:
            self.message = 'fetch list of demod modes failure' if failed else 'fetch list of demod modes success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

