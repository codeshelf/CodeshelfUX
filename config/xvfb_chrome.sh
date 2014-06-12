#!/bin/bash
echo "Starting chrome in Xvfb"
trap "echo Caught SIGINT, quitting; killall chrome; exit" SIGINT
trap "echo Caught SIGTERM, quitting; killall chrome; exit" SIGTERM
trap "echo Caught SIGKILL, quitting; killall chrome; exit" SIGKILL

xvfb-run -s "-screen 0 1024x768x24" /usr/bin/google-chrome --user-data-dir=/tmp --no-default-browser-check --no-first-run --disable-default-apps --disable-popup-blocking --disable-translate $1 &

# now just wait for signal
while true ; do sleep 0.1 ; done
