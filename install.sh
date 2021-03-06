echo ===================;
echo  Building DeeScord ;
echo ===================;

echo Entering Client directory;
cd ./client;

echo [1/3][1/3] Installing dependecies...;
npm i;

echo [1/3][2/3] Transpiling files...;
tsc;

echo [1/3][3/3] Linking files...;
node ./build.js;

cd ..;
echo Entering Server directory;
cd server;

echo [2/3][1/2] Installing dependecies...;
npm i;

echo [2/3][2/2] Transpiling files...;
tsc;

echo Installation finished;
echo Finishing;

echo [3/3][1/1] Allowing webserver;
cd ..;
sudo chgrp www-data . -R;
sudo chmod 775 . -R

echo ===================;
echo  Starting DeeScord ;
echo ===================;

cd ./server/out;
sudo service ascor-ml-node-server restart;
