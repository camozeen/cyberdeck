from ...dtos.gqrx.tcp import TcpSocketResponse

def mapTcpSocketResponse(rawResponse, failed=False, message=None):
    return TcpSocketResponse(rawResponse, failed=failed, message=message)
