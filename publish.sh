git add .
git commit -m 'publishing'

cd ~/api-watchman

echo "building"
npm run build

npm version minor

echo "publishing"
npm publish

git add .
git commit -m "published $(npm view psre version)"
git push origin master
echo 'successfully published'
