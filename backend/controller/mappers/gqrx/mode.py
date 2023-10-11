from ...dtos.gqrx.mode import GetModeResponse, SetModeRequest, SetModeResponse, ListSupportedModesResponse

def mapGetModeResponse(rawResponse, failed=False, message=None):
    try:
        if failed:
            raise Exception('failed by caller')
        if type(rawResponse) is not list:
            raise Exception('raw response is not a list');
        if len(rawResponse) != 2:
            # should contain mode, passband_hz
            raise Exception('raw response list should have 2 elements');

        mode = rawResponse[0]
        passband_hz = int(rawResponse[1])
        return GetModeResponse(mode, passband_hz, message=message)

    except Exception as e:
        return GetModeResponse(None, None, failed=True, message=message)

def mapSetModeRequest(rawRequest):
    try:
        if type(rawRequest) is not dict:
            raise Exception('raw request is not a dict');

        modeStr = rawRequest.get('mode')
        if modeStr is None:
            raise Exception('raw request object invalid');

        passbandHzStr = rawRequest.get('passband_hz')
        if passbandHzStr is None:
            raise Exception('raw request object invalid');

        mode = modeStr
        passbandHz = int(passbandHzStr)
        return SetModeRequest(mode, passbandHz)

    except Exception as e:
        print(e)
        return SetModeRequest(None, None, failed=True)

def mapSetModeResponse(mode, passband_hz, rawResponse, failed=False, message=None):
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

        return SetModeResponse(mode, passband_hz, message=message)

    except Exception as e:
        print(e)
        return SetModeResponse(mode, passband_hz, failed=True, message=message)
