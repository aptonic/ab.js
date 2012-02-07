#!/bin/sh

# This script grabs the latest ab.js from GitHub and hosts it in the 'latest' directory
# The latest version of ab.js is also copied into the root directory

rm -f master
rm -rf latest
mkdir latest
cd latest
wget https://github.com/aptonic/ab.js/tarball/master
tar xzvf master
cp -r aptonic-ab.js-*/* ./
cp -f ab.js ../
rm -rf aptonic-ab.js-*
rm -f master
cd ..
