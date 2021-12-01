#!/bin/sh

echo "building"
npm run build

git commit -am 'publishing'
#npm version minor

echo "publishing"
npm publish

git add .
git commit -m "published $(npm view psre version)"
git push origin master


merge-master-release api-watchman
echo 'successfully published'
