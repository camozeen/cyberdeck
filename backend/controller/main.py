import flask
import json
import os
import subprocess
from .client.gqrx import Client as GqrxClient

print('*** BASEDIR ***')
print(os.environ['BASEDIR'])

GQRX_HOST = '127.0.0.1'  # The server's hostname or IP address
GQRX_PORT = 7356  # The port used by the server
gqrx_client = GqrxClient(GQRX_HOST, GQRX_PORT)

app = flask.Flask(__name__, instance_relative_config=True)

@app.route('/')
def root():
    return json.dumps({ 'info': 'TODO' })

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

@app.route('/pm/pm2/list', methods=['GET'])
def pm_pm2_list():
    p = subprocess.run(['pm2', 'jlist'], capture_output=True)
    return p.stdout.decode()
