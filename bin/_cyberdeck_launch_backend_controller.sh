#!/bin/bash

spushd () {
    command pushd "$@" > /dev/null
}

spopd () {
    command popd "$@" > /dev/null
}

spushd ./backend/controller

./run_conda.sh radio

spopd
