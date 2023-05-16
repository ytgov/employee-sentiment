FROM oraclelinux:9

RUN dnf config-manager --set-enabled ol9_appstream
RUN dnf module enable -ySET  nodejs:18
RUN dnf install -y nodejs
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

RUN npm run build

WORKDIR /home/node/web
RUN npm run build

WORKDIR /home/node/app
EXPOSE 3000
ENV NODE_ENV=production

CMD ["node", "./dist/index.js"]
