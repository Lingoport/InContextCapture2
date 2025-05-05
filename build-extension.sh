#!/bin/bash

dpkg -s zip &> /dev/null
if [ $? -ne 0 ]
then
    if ! command -v zip &> /dev/null; then
        echo "Installing zip"
        sudo apt install zip
    fi
fi

dpkg -s jq &> /dev/null
if [ $? -ne 0 ]
then
    if ! command -v jq &> /dev/null; then
        echo "Installing jq"
        sudo apt install jq
    fi
fi

npm install
npm update

npx rollup -c rollup.config.js

cp package.json package.copy.json
jq 'del(.dependencies."single-file-cli")' package.copy.json > package.json
zip -r InContext Capture-extension-source.zip manifest.json package.json _locales src rollup*.js .eslintrc.js build-extension.sh
mv package.copy.json package.json

rm InContext Capture-extension-firefox.zip

cp src/core/bg/config.js config.copy.js
cp src/core/bg/companion.js companion.copy.js
sed -i "" 's/forceWebAuthFlow: false/forceWebAuthFlow: true/g' src/core/bg/config.js
sed -i "" 's/enabled: true/enabled: false/g' src/core/bg/companion.js
zip -r InContext Capture-extension-firefox.zip manifest.json lib _locales src
mv config.copy.js src/core/bg/config.js
mv companion.copy.js src/core/bg/companion.js
