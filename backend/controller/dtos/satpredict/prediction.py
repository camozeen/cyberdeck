import json

class GetSatellitePredictionRequest:
    def __init__(self, name, downlink_hz, failed=False):
        self.name = name
        self.downlink_hz = downlink_hz
        self.failed = failed

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

class GetSatellitePredictionResponse:
    def __init__(self, name, now, downlink_hz, data, failed=False, message=None):
        self.name = name
        self.now = now
        self.downlink_hz = downlink_hz
        self.data = data
        if message is not None:
            self.message = message
        else:
            self.message = 'get satellite prediction failed' if failed else 'get satellite prediction success'

    def toJson(self):
        return json.dumps(self, default=lambda o: o.__dict__)

