# Planner Backend

## Environment Variables

1. ```MYSQL_HOST```
2. ```MYSQL_PORT```
3. ```NODE_PORT```
4. ```MYSQL_USERNAME```
5. ```MYSQL_PASSWORD```
6. ```MYSQL_DB_NAME```
7. ```JWT_SECRET```
8. ```CAS_URL```
9. ```SERVICE_URL```

## Local Development

1. You need a MYSQL server for the API to communicate with. Setting one up locally with Docker is recommended.
2. You need to mock the VT CAS. Running an API locally is recommended. This API must have the endpoints ```/profile/cas``` and ```/profile/cas/serviceValidate```. It must also mimic in other ways the functionality of VT CAS (such as providing the necessary XML data for creating the JWT used for authentication)
3. Create a ```.env``` file with all of the above variables correctly filled in.
4. Run ```npm run start:local```
