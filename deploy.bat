call npm run build 
tar -cvf ./deploy.tar --exclude *.map ./captain-definition ./dist/**
caprover deploy -n caprover-jpolvora -a spa -t ./deploy.tar --default