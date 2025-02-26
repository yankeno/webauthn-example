FROM node:20.18.3

WORKDIR /webauthn-app

RUN npm install -g npm@10.8.2

COPY package.json package-lock.json ./
RUN npm install

CMD ["npm", "run", "dev"]

