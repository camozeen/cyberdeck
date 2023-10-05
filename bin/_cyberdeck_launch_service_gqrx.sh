#!/bin/bash

spushd () {
    command pushd "$@" > /dev/null
}

spopd () {
    command popd "$@" > /dev/null
}


gqrx
