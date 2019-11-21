tar -cvf ./deploy.tar --exclude *.map ./captain-definition ./dist/*

caprover deploy -t ./deploy.tar