#!/bin/bash

spushd () {
    command pushd "$@" > /dev/null
}

spopd () {
    command popd "$@" > /dev/null
}

spushd ./bin 
  source _cyberdeck_ini_parser.sh
spopd

process_ini_file 'env.conf'

spushd ./services/aprs_forwarder

APRS_SERVICE_HTTP_PORT=$(get_value 'controller' 'port') \
APRS_SERVICE_HTTP_RESOURCE=/services/aprs/message \
  ./run_conda.sh radio

spopd
