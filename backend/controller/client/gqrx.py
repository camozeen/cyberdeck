import socket

from ..mappers.gqrx.frequency import mapGetFrequencyResponse, mapSetFrequencyRequest, mapSetFrequencyResponse
from ..mappers.gqrx.connection import mapConnectionResponse, mapCloseResponse
from ..mappers.gqrx.tcp import mapTcpSocketResponse

class Client:
    def __init__(self, host, port):
        self.host = host
        self.port = port
        self._connection = None

    def connect(self):
        s = None

        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((self.host, self.port))
        except:
            return mapConnectionResponse(failed=true)

        self._connection = s
        return mapConnectionResponse()

    def close(self):
        if self._connection is not None:
            self._connection.close();
            self._connection = None
        return mapCloseResponse()

    def _request(self, payload):
        if self._connection is None:
            return mapTcpSocketResponse(None, failed=True, message='request failure: not connected')

        try:
            self._connection.sendall(payload)
            data = self._connection.recv(1024)
            datastr = data.decode()
            return mapTcpSocketResponse(datastr.splitlines())
        except Exception as err:
            return mapTcpSocketResponse(None, failed=True, message='request failure: request/response')

    def get_frequency(self):
        payload = 'f\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapGetFrequencyResponse(None, failed=True, message='get_frequency: tcp failure')
        return mapGetFrequencyResponse(tcp_response.rawResponse)

    def set_frequency(self, rawRequest):
        requestDto = mapSetFrequencyRequest(rawRequest)
        if requestDto.failed:
            return mapSetFrequencyResponse(0, None, failed=True, message='set_frequency: bad payload')
        payload = f'F {requestDto.hz}'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapSetFrequencyResponse(requestDto.hz, None, failed=True, message='set_frequency: tcp failure')
        return mapSetFrequencyResponse(requestDto.hz, tcp_response.rawResponse)
