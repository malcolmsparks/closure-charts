#!/bin/bash
echo "Cloning"
hg clone https://closure-charts.googlecode.com/hg/ closure-charts 
read -n1 -r -p "Press any key to continue..." key

echo "Exporting"
cd closure-charts/closure-library/src/main/webapp/js
svn export --force http://closure-library.googlecode.com/svn/trunk/closure/goog goog
cd ../../../../../..
read -n1 -r -p "Press any key to continue..." key

echo "Applying patches"
ln -s closure-charts/closure-library/src/main/webapp/js closure
cat patches.txt | xargs -n 1 patch -p0 -i
read -n1 -r -p "Press any key to continue..." key

echo "Committing"
cd closure-charts
hg commit --addremove --message "Library update" --user "update script"
cd ..
read -n1 -r -p "Press any key to continue..." key

echo "Pushing"
cd closure-charts
hg push
cd ..
read -n1 -r -p "Press any key to continue..." key

echo "Tidying up"
rm -rf closure-charts
rm -rf closure