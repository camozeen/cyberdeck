#!/bin/bash

spushd () {
    command pushd "$@" > /dev/null
}

spopd () {
    command popd "$@" > /dev/null
}

spushd ./frontend/console

node index.js

spopd
