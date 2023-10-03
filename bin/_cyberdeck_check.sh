#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

spushd () {
    command pushd "$@" > /dev/null
}

spopd () {
    command popd "$@" > /dev/null
}

spushd $SCRIPT_DIR
source _cyberdeck_ini_parser.sh
spushd ..
process_ini_file 'env.conf'
echo $(get_value 'section1' 'value1')
spopd
spopd
