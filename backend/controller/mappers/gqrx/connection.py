from ...dtos.gqrx.connection import ConnectResponse, CloseResponse

def mapConnectionResponse(failed=False):
    return ConnectResponse(failed=failed)

def mapCloseResponse(failed=False):
    return CloseResponse(failed=failed)
