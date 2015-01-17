#!/usr/bin/env bash
NPM_CMD=$(which npm 2> /dev/null)
YUM_CMD=$(which yum 2> /dev/null)
APT_GET_CMD=$(which apt-get 2> /dev/null)
BREW_CMD=$(which brew 2> /dev/null)

#make sure npm is installed

if [[ -z $NPM_CMD ]]; then
    if [[ ! -z $YUM_CMD ]]; then
        sudo yum install npm
    elif [[ ! -z $APT_GET_CMD ]]; then
        sudo apt-get install npm
        sudo ln -s /usr/bin/nodejs /usr/bin/node
    elif [[ ! -z $BREW_CMD ]]; then
        brew install node
    else
        echo "error can't install package npm"
        exit 1;
    fi
fi

# Download development and app dependencies

npm install

#Download additional app  dependencies only available from bower
./node_modules/.bin/bower install
