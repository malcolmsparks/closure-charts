#!/bin/bash
echo "Creating Maven-friendly directory structure.."
mkdir -p working/src/main/webapp/js/
mkdir -p working/src/main/webapp/META-INF/
cp -r ../closure-charts/src/main/webapp/js/ working/src/main/webapp/
cp -r ../closure-library/src/main/webapp/js/ working/src/main/webapp/
cp pom.xml working/pom.xml
hg tip > working/src/main/webapp/META-INF/closure-charts-VERSION.txt
cd working
echo "Deploying to Maven"
mvn deploy
echo "Cleaning working directories"
cd ..
rm -fr working

