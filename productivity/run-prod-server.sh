#A "Production" server. Which means it does not have hot code deploy to client and simply builds the latest bundle and serves statically

./build-dist.sh
python -m SimpleHTTPServer
