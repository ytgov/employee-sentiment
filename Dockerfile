FROM oraclelinux:8

RUN dnf module enable -y nodejs:18
RUN dnf install -y oracle-instantclient-release-el8
RUN dnf install -y nodejs 

RUN yum upgrade -y && yum install yum-utils
RUN yum-config-manager --enable *addons
RUN yum install -y gcc-c++ make libaio

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

#RUN cp /opt/oracle/instantclient_21_10/{libclntsh.so,libclntshcore.so,libnnz21.so,libociei.so} /home/node/app/node_modules/oracledb/build/Release
#RUN cd /home/node/app/node_modules/oracledb/build/Release/ && ln -s libclntsh.dylib.19.1 libclntsh.dylib

RUN npm run build

ENV NODE_ENV=production
WORKDIR /home/node/web
RUN npm run build
WORKDIR /home/node/app
EXPOSE 3000

CMD ["node", "./dist/index.js"]
