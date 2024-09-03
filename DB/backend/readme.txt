Kokatha Backend
===============

Libraries / Dependencies
------------------------

1. Cors - Block unknown connections, http security
        Default - Accept all connection
        Configure - specify ip address

2. Csv - Load csv file, -> JSON array

        [ {}, {}, ... ]

3. dotenv - Access to local environment variables
            from .env file.

4. express - web server application, access -> apis, connection
            to db.

5. nodemailer - send emails

6. nodemon - development server, reload server after code changes

7. mongoose - tools to connect and manipulate the mongodb database
              from a nodejs server.

Status Codes
============
200 - Success request
201 - Created successfully
400 - Invalid request/Bad request
401 - Permission denied
500 - System crash
404 - resource not found
