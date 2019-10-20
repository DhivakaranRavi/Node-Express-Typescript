
# School Assignment

This API provides endpoints for teachers to perform administrative functions for their students. Teachers and students are identified by their email addresses.

### Tech Stack

[Node , Express , TypeORM , MySQL]

## Getting Started

### Installing through docker compose

Clone the repository

Prerequisites 

change .env  MYSQL_HOST= docker &  REDIS_HOST= redis
 
Install **docker** and **docker compose** and then open folder directory excute the below

```
docker-compose up

```

### Installing manually 

Prerequisites 

change .env  MYSQL_HOST= localhost

**Npm  -v6.9.0**

**Node -v10.16.0**

**Redis v4.0.9**



clone the repository

```
yarn install or npm install

```

## Deployment

```
yarn global add nodemon or npm install -g nodemon 
npm  run nodemon
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

if you want check works redis please uncomment and comment the following line in  src/app/controller/school.ts and restart the server

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
            //response.status(200).json({ students });
            
          
          
            request['redis'].set(
            request['redis_key'],
            JSON.stringify({ recipients }),
            'EX',
            process.env.REDIS_EXPIRY,
            () => {
            response.status(200).json({ recipients });
            },
            );
           // response.status(200).json({ recipients })
            
```





# Endpoints

Register API - [http://34.219.206.113:8085/api/register](http://34.219.206.113:8085/api/register)

Method - post

Content-Type: application/json

Sample payload
```
{
  "teacher": "dhivakaran.ravi@gmail.com",
  "students": [
    "ram@gmail.com",
    "john@gmail.com"
  ]
}
```
Response 

```
status code 204
```

Get Student List -

[http://34.219.206.113:8085/api/commonstudents](http://34.219.206.113:8085/api/commonstudents)

[http://34.219.206.113:8085/api/commonstudents?teacher=dhivkaran.ravi@gmail.com](http://34.219.206.113:8085/api/commonstudents?teacher=dhivkaran.ravi@gmail.com)

Method - GET

Content-Type: application/json


Response 

```
{
  "students": [
    "ram@gmail.com",
    "john@gmail.com"
  ]
}
```

Get Student List -

[http://34.219.206.113:8085/api/commonstudents](http://34.219.206.113:8085/api/commonstudents)

[http://34.219.206.113:8085/api/commonstudents?teacher=dhivkaran.ravi@gmail.com](http://34.219.206.113:8085/api/commonstudents?teacher=dhivkaran.ravi@gmail.com)

Method - GET

Content-Type: application/json


Response 

```
{
  "students": [
    "ram@gmail.com",
    "john@gmail.com"
  ]
}
```


Student Suspend API -

[http://34.219.206.113:8085/api/suspend](http://34.219.206.113:8085/api/suspend)

Method - Post 

Content-Type: application/json


Sample payload
```
{
  "student": "john@gmail.com",
}
```

Response 

```
status code 204
```


Retrieve For Notification  API -

[http://34.219.206.113:8085/api/retrievefornotifications](http://34.219.206.113:8085/api/retrievefornotifications)

Method - Post 

Content-Type: application/json


Sample payload
```
{
  "teacher": "dhivakaran.ravi@gmail.com",
  "notification": "Hello students! @kabil@gmail.com @siva@gmail.com;"
}
```

Response 

```
{
  "recipients" [
    "kabil@gmail.com",
    "siva@gmail.com",
    "jeeva@gmail.com"
  ]
}
```




## Author

**Dhivakaran Ravi**