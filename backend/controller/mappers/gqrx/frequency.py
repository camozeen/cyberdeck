from ...dtos.gqrx.frequency import GetFrequencyResponse, SetFrequencyRequest, SetFrequencyResponse

def mapGetFrequencyResponse(rawResponse, failed=False, message=None):
    try:
        if failed:
            raise Exception('failed by caller')
        if type(rawResponse) is not list:
            raise Exception('raw response is not a list');
        if len(rawResponse) != 1:
            raise Exception('raw response list should have 1 element');

        hz = int(rawResponse[0])
        return GetFrequencyResponse(hz, message=message)

    except Exception as e:
        return GetFrequencyResponse(0, failed=True, message=message)

def mapSetFrequencyRequest(rawRequest):
    try:
        if type(rawRequest) is not dict:
            raise Exception('raw request is not a dict');

        hzStr = rawRequest.get('hz')
        if hzStr is None:
            raise Exception('raw request object invalid');

        hz = int(hzStr)
        return SetFrequencyRequest(hz)

    except Exception as e:
        print(e)
        return SetFrequencyRequest(0, failed=True)

def mapSetFrequencyResponse(hz, rawResponse, failed=False, message=None):
    try:
        if failed:
            raise Exception('failed by caller')
        if type(rawResponse) is not list:
            raise Exception('raw response is not a list');
        if len(rawResponse) != 1:
            raise Exception('raw response list should have 1 element');

        rprtStr = rawResponse[0]
        if not rprtStr.startswith('RPRT'):
            raise Exception('raw response bad format');

        rprt = rprtStr.split(' ')[1]
        rprt = int(rprt)
        if rprt > 0:
            raise Exception('rprt status indicates failure from gqrx')

        return SetFrequencyResponse(hz, message=message)

    except Exception as e:
        print(e)
        return SetFrequencyResponse(hz, failed=True, message=message)
