#!/bin/bash
echo "Creating Maven-friendly directory structure.."
mkdir -p working/src/main/webapp/js/
cp -r ../closure-charts/src/main/webapp/js/ working/src/main/webapp/
cp -r ../closure-library/src/main/webapp/js/ working/src/main/webapp/
cp pom.xml working/pom.xml
echo "Deploying to Maven"
cd working
mvn deploy
echo "Cleaning working directories"
cd ..
rm -fr target
rm -fr working

