FROM oraclelinux:9

RUN dnf config-manager --set-enabled ol9_appstream
RUN dnf module enable -y nodejs:18
RUN dnf install -y nodejs wget unzip

RUN mkdir -p /opt/oracle
WORKDIR /opt/oracle
RUN wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basic-linuxx64.zip
RUN unzip instantclient-basic-linuxx64.zip

ENV TZ America/Whitehorse
RUN mkdir /home/node 
RUN mkdir /home/node/web 

WORKDIR /home/node/web
COPY src/web/package*.json ./
COPY .env* ./
RUN npm install && npm cache clean --force --loglevel=error
COPY src/web ./

RUN mkdir /home/node/app 
RUN mkdir /home/node/app/db
WORKDIR /home/node/app
COPY src/api/package*.json ./
COPY .env* ./

ENV NODE_ENV=development
RUN npm install && npm cache clean --force --loglevel=error
COPY src/api ./

RUN cp /opt/oracle/instantclient_21_10/{libclntsh.so,libclntshcore.so,libnnz21.so,libociei.so} /home/node/app/node_modules/oracledb/build/Release
#RUN cd /home/node/app/node_modules/oracledb/build/Release/ && ln -s libclntsh.dylib.19.1 libclntsh.dylib

RUN npm run build

ENV NODE_ENV=production
WORKDIR /home/node/web
RUN npm run build

WORKDIR /home/node/app
EXPOSE 3000

CMD ["node", "./dist/index.js"]
