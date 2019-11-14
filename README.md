
# NODE Typescript

### Tech Stack

[Node , Express , TypeORM , MySQL]

## Getting Started

### Installing through docker compose

Clone the repository

Prerequisites 

change .env  MYSQL_HOST= database &  REDIS_HOST= redis
 
Install **docker** and **docker compose** and then open folder directory excute the below

```
docker-compose up or docker-compose up -d

```

### Installing manually 

Prerequisites 

change .env  MYSQL_HOST= localhost

create a database school 

```
CREATE DATABASE school;
```

**Npm  - v6.9.0**

**Node - v10.16.0**

**Redis - v4.0.9**

**MySQL - v8.0.16**



clone the repository

```
yarn install or npm install

```

## Deployment

```
yarn global add nodemon or npm install -g nodemon 
npm run nodemon
```

## Test

```
npm test

```

## Production

```
npm run build
npm start

```

### Running On

[Application runing on url 📡 http://34.219.206.113:8085/](http://34.219.206.113:8085/)<br>
[Explore running on url 📕 http://34.219.206.113:8085/api-docs/](http://34.219.206.113:8085/api-docs/)


## Note

Currently redis cache not working.

if you want check works redis please add and comment the following line in  src/app/controller/school.ts and restart the server

```
            request['redis'].set(
            request['redis_key'],
            JSON.stringify({ students }),
            'EX',
            process.env.REDIS_EXPIRY,
            () => {
              response.status(200).json({ students });
            },
            )
       line number 212  //response.status(200).json({ students });
            
          
          
            request['redis'].set(
            request['redis_key'],
            JSON.stringify({ recipients }),
            'EX',
            process.env.REDIS_EXPIRY,
            () => {
            response.status(200).json({ recipients });
            },
            );
       line number 268  // response.status(200).json({ recipients })
            
```

## Author

**Dhivakaran Ravi**
