rm -rf ../prod
mkdir ../prod
mv ./dist-prod ../prod/dist-prod
mv ./public ../prod/public
mv ./node_modules ../prod/node_modules
rm -rf .git
rm -rf *