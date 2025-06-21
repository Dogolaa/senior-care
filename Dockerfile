# ------------------- PARA PRODUÇÃO ---------------------------

# FROM node:20

# WORKDIR /app

# RUN apt-get update && apt-get install -y netcat-openbsd

# COPY package*.json ./
# RUN npm install

# COPY . .

# RUN npm run build

# CMD ["/bin/sh", "-c", "npm run migration:run && npm run test && npm run start:prod"]

# Dockerfile

# ------------------- PARA DESENVOLVIMENTO ---------------------------

FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "start:dev"]