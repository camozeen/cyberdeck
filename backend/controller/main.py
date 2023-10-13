import flask
import json
import os
import subprocess
import redis
import codecs
from .client.gqrx import Client as GqrxClient
from .client.satpredict import get_aos as satpredict

print('*** BASEDIR ***')
print(os.environ['BASEDIR'])

GQRX_HOST = '127.0.0.1'  # The server's hostname or IP address
GQRX_PORT = 7356  # The port used by the server
gqrx_client = GqrxClient(GQRX_HOST, GQRX_PORT)
r = redis.Redis(host='localhost', port=6379, db=0)

app = flask.Flask(__name__, instance_relative_config=True)

@app.route('/')
def root():
    return json.dumps({ 'info': 'TODO' })

@app.route('/docs/<slug>', methods=['GET'])
def docs(slug):
    content_path = os.path.join(os.environ['BASEDIR'], 'docs', slug, 'console.txt')
    with codecs.open(content_path, 'r', 'utf-8') as f:
        content = f.read();
    return json.dumps({ 'doc': content })

@app.route('/gqrx/connect', methods=['POST'])
def gqrx_connect():
    return gqrx_client.connect().toJson()

@app.route('/gqrx/close', methods=['POST'])
def gqrx_close():
    return gqrx_client.close().toJson()

@app.route('/gqrx/frequency', methods=['GET', 'POST'])
def gqrx_frequency():
    if flask.request.method == 'POST':
        return gqrx_client.set_frequency(flask.request.get_json()).toJson()
    else:
        return gqrx_client.get_frequency().toJson()

@app.route('/gqrx/mode', methods=['GET', 'POST'])
def gqrx_mode():
    if flask.request.method == 'POST':
        return gqrx_client.set_mode(flask.request.get_json()).toJson()
    else:
        return gqrx_client.get_mode().toJson()

@app.route('/gqrx/dsp', methods=['GET', 'POST'])
def gqrx_dsp():
    if flask.request.method == 'POST':
        return gqrx_client.set_dsp_state(flask.request.get_json()).toJson()
    else:
        return gqrx_client.get_dsp_state().toJson()

@app.route('/gqrx/record/start', methods=['POST'])
def gqrx_record_start():
    return gqrx_client.start_recording().toJson()

@app.route('/gqrx/record/stop', methods=['POST'])
def gqrx_record_stop():
    return gqrx_client.stop_recording().toJson()

@app.route('/pm/pm2/list', methods=['GET'])
def pm_pm2_list():
    p = subprocess.run(['pm2', 'jlist'], capture_output=True)
    return p.stdout.decode()

@app.route('/services/aprs/launch', methods=['POST'])
def services_aprs_launch():
    p = subprocess.run(['pm2', 'start', 'bin/_cyberdeck_launch_service_aprs_forwarder.sh'], cwd=os.environ['BASEDIR'])
    return '{ "message": "ok" }'

@app.route('/services/aprs/kill', methods=['POST'])
def services_aprs_kill():
    subprocess.run(['pm2', 'stop', '_cyberdeck_launch_service_aprs_forwarder'], cwd=os.environ['BASEDIR'])
    subprocess.run(['pm2', 'delete', '_cyberdeck_launch_service_aprs_forwarder'], cwd=os.environ['BASEDIR'])
    return '{ "message": "ok" }'

@app.route('/services/aprs/message', methods=['POST'])
def services_aprs_message():
    body = flask.request.get_json()
    if body['data'].startswith('APRS'):
        r.publish('aprs', json.dumps({
            'data': body['data'].strip(),
            'ts': body['ts']
        }))
    return '{ "message": "ok" }'

@app.route('/services/gqrx/launch', methods=['POST'])
def services_gqrx_launch():
    p = subprocess.run(['pm2', 'start', 'bin/_cyberdeck_launch_service_gqrx.sh'], cwd=os.environ['BASEDIR'])
    return '{ "message": "ok" }'

@app.route('/services/gqrx/kill', methods=['POST'])
def services_gqrx_kill():
    subprocess.run(['pm2', 'stop', '_cyberdeck_launch_service_gqrx'], cwd=os.environ['BASEDIR'])
    subprocess.run(['pm2', 'delete', '_cyberdeck_launch_service_gqrx'], cwd=os.environ['BASEDIR'])
    return '{ "message": "ok" }'

@app.route('/services/gqrx/status', methods=['GET'])
def services_gqrx_status():
    p = subprocess.run(['pm2', 'jlist'], capture_output=True)
    result = json.loads(p.stdout.decode())
    status = { 'status': 'off' }
    for r in result:
        if r['name'] == '_cyberdeck_launch_service_gqrx':
            status = { 'status': r['pm2_env']['status'] }
    return json.dumps(status)

@app.route('/services/satpredict/launch', methods=['POST'])
def services_satpredict_launch():
    p = subprocess.run(['pm2', 'start', 'bin/_cyberdeck_launch_service_satpredict.sh'], cwd=os.environ['BASEDIR'])
    return '{ "message": "ok" }'

@app.route('/services/satpredict/kill', methods=['POST'])
def services_satpredict_kill():
    subprocess.run(['pm2', 'stop', '_cyberdeck_launch_service_satpredict'], cwd=os.environ['BASEDIR'])
    subprocess.run(['pm2', 'delete', '_cyberdeck_launch_service_satpredict'], cwd=os.environ['BASEDIR'])
    return '{ "message": "ok" }'

@app.route('/services/satpredict/status', methods=['GET'])
def services_satpredict_status():
    p = subprocess.run(['pm2', 'jlist'], capture_output=True)
    result = json.loads(p.stdout.decode())
    status = { 'status': 'off' }
    for r in result:
        if r['name'] == '_cyberdeck_launch_service_satpredict':
            status = { 'status': r['pm2_env']['status'] }
    return json.dumps(status)

@app.route('/satpredict/predictions', methods=['POST'])
def satpredict_predictions():
    return satpredict(flask.request.get_json()).toJson()
