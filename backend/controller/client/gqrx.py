import socket

from ..mappers.gqrx.frequency import mapGetFrequencyResponse, mapSetFrequencyRequest, mapSetFrequencyResponse
from ..mappers.gqrx.connection import mapConnectionResponse, mapCloseResponse
from ..mappers.gqrx.tcp import mapTcpSocketResponse
from ..mappers.gqrx.mode import mapGetModeResponse, mapSetModeRequest, mapSetModeResponse
from ..mappers.gqrx.dsp import mapGetDspStateResponse, mapSetDspStateRequest, mapSetDspStateResponse
from ..mappers.gqrx.recording import mapStartRecordingResponse, mapStopRecordingResponse

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
        payload = f'F {requestDto.hz}\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapSetFrequencyResponse(requestDto.hz, None, failed=True, message='set_frequency: tcp failure')
        return mapSetFrequencyResponse(requestDto.hz, tcp_response.rawResponse)

    def list_supported_modes(self):
        pass

    def get_mode(self):
        payload = 'm\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapGetModeResponse(None, failed=True, message='get_mode: tcp failure')
        return mapGetModeResponse(tcp_response.rawResponse)

    def set_mode(self, rawRequest):
        requestDto = mapSetModeRequest(rawRequest)
        if requestDto.failed:
            return mapSetModeResponse(None, None, None, failed=True, message='set_mode: bad payload')
        payload = f'M {requestDto.mode} {requestDto.passband_hz}\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapSetModeResponse(requestDto.mode, requestDto.passband_hz, failed=True, message='set_mode: tcp failure')
        return mapSetModeResponse(requestDto.mode, requestDto.passband_hz, tcp_response.rawResponse)

    def get_dsp_state(self):
        payload = 'u DSP\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapGetDspStateResponse(None, failed=True, message='get_dsp_state: tcp failure')
        return mapGetDspStateResponse(tcp_response.rawResponse)

    def set_dsp_state(self, rawRequest):
        requestDto = mapSetDspStateRequest(rawRequest)
        if requestDto.failed:
            return mapSetDspStateResponse(None, None, failed=True, message='set_dsp_state: bad payload')
        flag2Bit = '1' if requestDto.flag else '0'
        payload = f'U DSP {flag2Bit}\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapSetDspStateResponse(requestDto.flag, None, failed=True, message='set_dsp_state: tcp failure')
        return mapSetDspStateResponse(requestDto.flag, tcp_response.rawResponse)

    def start_recording(self):
        payload = f'AOS\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapStartRecordingResponse(None, failed=True, message='start_recording: tcp failure')
        return mapStartRecordingResponse(tcp_response.rawResponse)

    def stop_recording(self):
        payload = f'LOS\n'
        tcp_response = self._request(payload.encode('ascii'))
        if tcp_response.failed:
            return mapStopRecordingResponse(None, failed=True, message='stop_recording: tcp failure')
        return mapStopRecordingResponse(tcp_response.rawResponse)
