#!/bin/sh

echo "building"
npm run build

git commit -am 'publishing'
npm version minor

echo "publishing"
npm publish

git add .
git commit -m "published $(npm view psre version)"
git push origin master

# merging release branch
echo "merging master --> release"
curl \
  -X POST \
  -u "AyushmanTripathy":$(cat ~/.pat) \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/AyushmanTripathy/pipe-script/merges" \
  -d '{"base":"release","head":"master"}'
echo "merge complete"

echo 'successfully published'
