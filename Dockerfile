FROM node:20-bookworm

RUN apt-get update && apt-get install -y \
  graphicsmagick \
  ghostscript \
  imagemagick \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["npm", "start"]
