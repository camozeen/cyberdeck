from ...dtos.gqrx.dsp import GetDspStateResponse, SetDspStateRequest, SetDspStateResponse

def mapGetDspStateResponse(rawResponse, failed=False, message=None):
    try:
        if failed:
            raise Exception('failed by caller')
        if type(rawResponse) is not list:
            raise Exception('raw response is not a list');
        if len(rawResponse) != 1:
            raise Exception('raw response list should have 1 element');

        is_on = int(rawResponse[0])
        return GetDspStateResponse(is_on, message=message)

    except Exception as e:
        return GetDspStateResponse(0, failed=True, message=message)

def mapSetDspStateRequest(rawRequest):
    try:
        if type(rawRequest) is not dict:
            raise Exception('raw request is not a dict');

        flag = rawRequest.get('flag')
        if flag is None:
            raise Exception('raw request object invalid');

        return SetDspStateRequest(flag)

    except Exception as e:
        print(e)
        return SetDspStateRequest(None, failed=True)

def mapSetDspStateResponse(flag, rawResponse, failed=False, message=None):
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

        return SetDspStateResponse(flag, message=message)

    except Exception as e:
        print(e)
        return SetDspStateResponse(flag, failed=True, message=message)
