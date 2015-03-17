#!/usr/bin/env bash
type -P  npm
type -P  npm &>  /dev/null && echo "NPM Found"
NPM_CMD=$(type -P  npm &>  /dev/null && echo "NPM Found")
YUM_CMD=$(type -P yum &> /dev/null && echo "Found")
APT_GET_CMD=$(type -P apt-get &> /dev/null && echo "Found")
BREW_CMD=$(type brew &> /dev/null && echo "Found")

echo $NPM_CMD
echo "$NPM_CMD"
#make sure npm is installed
if [ -z "$NPM_CMD" ]; then
    if [ ! -z "$YUM_CMD" ]; then
        sudo yum install npm
    elif [ ! -z "$APT_GET_CMD" ]; then
        sudo apt-get install npm
        sudo ln -s /usr/bin/nodejs /usr/bin/node
    elif [ ! -z "$BREW_CMD" ]; then
        brew install node
    else
        echo "error can't install package npm"
        exit 1;
    fi
fi

# Download development and app dependencies
npm cache clean

npm install bower

npm install

#Download additional app  dependencies only available from bower
./node_modules/.bin/bower install
