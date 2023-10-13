from ...dtos.satpredict.prediction import GetSatellitePredictionRequest, GetSatellitePredictionResponse

def mapGetSatellitePredictionRequest(rawRequest):
    try:
        if type(rawRequest) is not dict:
            raise Exception('raw request is not a dict');

        name = rawRequest.get('name')
        if name is None:
            raise Exception('raw request object invalid');

        downlinkHzStr = rawRequest.get('downlink_hz')
        if downlinkHzStr is None:
            raise Exception('raw request object invalid');

        downlinkHz = int(downlinkHzStr)
        return GetSatellitePredictionRequest(name, downlinkHz)

    except Exception as e:
        print(e)
        return GetSatellitePredictionRequest(None, None, failed=True)

def mapGetSatellitePredictionResponse(name, now, downlink_hz, rawResponse, failed=False, message=None):
    try:
        if failed:
            raise Exception('failed by caller')
        if type(rawResponse) is not list:
            raise Exception('raw response is not a list');

        return GetSatellitePredictionResponse(name, now, downlink_hz, rawResponse, message=message)

    except Exception as e:
        print(e)
        return GetSatellitePredictionResponse(None, None, None, None, failed=True, message=message)
