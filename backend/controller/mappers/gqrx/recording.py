from ...dtos.gqrx.recording import StartRecordingResponse, StopRecordingResponse

def mapStartRecordingResponse(rawResponse, failed=False, message=None):
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

        return StartRecordingResponse(message=message)

    except Exception as e:
        print(e)
        return StartRecordingResponse(failed=True, message=message)

def mapStopRecordingResponse(rawResponse, failed=False, message=None):
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

        return StopRecordingResponse(message=message)

    except Exception as e:
        print(e)
        return StopRecordingResponse(failed=True, message=message)
