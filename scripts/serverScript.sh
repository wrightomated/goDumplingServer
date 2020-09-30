cd ./goDumplingServer
git pull
npm install
npm run build
pm2 stop dumpling
pm2 start ./built/index.js --name dumpling
