import socket
import time
from datetime import datetime
import pandas as pd
import os

from ..mappers.satpredict.prediction import mapGetSatellitePredictionRequest, mapGetSatellitePredictionResponse

def parsePredictions(sat_name, raw, now, downlink_hz):
    rows = ''.join(raw)
    rows = rows.split('\n')
    result = []
    for row in rows:
        if len(row) == 0:
            continue
        r = row.split(' ')
        ts = int(r[0])
        info = [i for i in filter(lambda x: len(x) > 0, r[4:])]
        doppler = float(info[-1])
        shift_hz = int(downlink_hz + (doppler * (downlink_hz / float(100000000))))
        result.append({
            'key': f'{sat_name}-{ts}-{info[6]}',
            'sat_name': sat_name,
            'ts': ts,
            'utc': datetime.utcfromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'),
            'est': datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'),
            'el': float(info[0]),
            'az': float(info[1]),
            'phase': float(info[2]),
            'lat': float(info[3]),
            'lng': float(info[4]),
            'slant': float(info[5]),
            'orbit': int(info[6]),
            'insun': True if '*' in info else False,
            'doppler': doppler,
            'shift_hz': shift_hz,
            '_ts_prediction': now,
            '_seconds_to_aos': ts - now,
            '_minutes_to_aos': (ts - now) / 60.,
            '_days_to_aos': (ts - now) / 86400,
        })
    return result
    
def get_aos(rawRequest, N_pass=5, aos_increment=5400):
    now = int(time.time())
    request = mapGetSatellitePredictionRequest(rawRequest);
    sat_name = request.name
    downlink_hz = request.downlink_hz
    print(f'INFO: fetching AOS data for {sat_name}')
    server_address_port = (os.environ['SATPREDICT_HOST'], int(os.environ['SATPREDICT_PORT']))
    buffer_size = 64000
    eof = b'\x1a\n'
    df = None
    with socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM) as s:
        # get next AOS
        print(f'INFO: fetching initial AOS {sat_name}')
        payload = f'GET_SAT {sat_name}\n'
        bytes_payload = str.encode(payload)

        s.sendto(bytes_payload, server_address_port)
        msg_from_server = s.recvfrom(buffer_size)
        sat_aos= int(msg_from_server[0].decode('utf-8').split('\n')[5])
        print(f'INFO: successfully fetched initial AOS for {sat_name}: {sat_aos}')
        
        i_pass = 0
        while i_pass < N_pass:
            print(f'INFO: fetching predictions for {sat_name} starting on {sat_aos}')
            payload = f'PREDICT {sat_name} {sat_aos} +15m\n'
            bytes_payload = str.encode(payload)
            s.sendto(bytes_payload, server_address_port)
            agg = []
            while True:
                msg_from_server = s.recvfrom(buffer_size)
                if msg_from_server[0] == eof:
                    break
                agg.append(msg_from_server[0].decode('utf-8'))
            print(f'INFO: successfully fetched predictions for {sat_name} starting on {sat_aos}')
            preds = parsePredictions(sat_name, agg, now, downlink_hz)
            new_df = pd.DataFrame(preds)

            if df is None:
                df = new_df
            else:
                df = pd.concat([df, new_df], ignore_index=True)

            i_pass = i_pass + 1
            sat_aos = new_df['ts'].max() + aos_increment

    # consistancy check to make sure that the same pass is not included
    # in the aggreggated pass list
    if df is None or df['key'].nunique() != len(df):
        raise Exception('BAD PREDICTION')

    return mapGetSatellitePredictionResponse(sat_name, now, downlink_hz, df.to_dict(orient='records'))
