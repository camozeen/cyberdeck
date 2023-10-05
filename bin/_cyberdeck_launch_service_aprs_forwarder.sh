#!/bin/bash

spushd () {
    command pushd "$@" > /dev/null
}

spopd () {
    command popd "$@" > /dev/null
}

spushd ./services/aprs_forwarder

APRS_SERVICE_HTTP_PORT=5000 APRS_SERVICE_HTTP_RESOURCE=/services/aprs/message ./run_conda.sh radio

spopd
