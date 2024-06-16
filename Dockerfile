FROM node:20-alpine3.19

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]
