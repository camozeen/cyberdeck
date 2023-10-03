#!/bin/bash

conda_env=""
if [ -z "$1" ]; then
  conda_env=" "
else
  conda_env=" -n $1 "
fi

eval "FLASK_APP=main.py conda run --live-stream${conda_env}flask run"
