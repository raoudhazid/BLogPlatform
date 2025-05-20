## MEAN Stack Technical Test Microservices Backend
This backend consists of three microservices: User Management and Authentication (port 5001), Article and Comment Management (port 5002). Each service is a Node.js/Express application with its own MongoDB database, communicating via HTTP for notifications.


## Prerequisites

Ensure the following are installed:
- Node.js (v16 or higher): Download
- MongoDB (v4.4 or higher): Download
- npm (included with Node.js)
- Git: For cloning the repository
- Swagger for APIS 

## Setup Instructions

- Clone the Repository:
  git  clone   
 

## Install Dependencies:

For User Management and Authentication (user-auth-service):cd user-auth-service
##  npm install


For Article and Comment (article-comment-service):cd article-comment-service
## npm install



Set Up MongoDB:

Ensure MongoDB is running locally or on a cloud service.
Start MongoDB locally:mongod






Running the Services

User Management and Authentication Service:
cd user-auth-service
npm start


Runs on http://localhost:5001.


Article and Comment Service:
cd article-comment-service
npm start


Runs on http://localhost:5002.



Ensure services are running in order: User-Auth, Article-Comment.

Troubleshooting

Check MongoDB connections and .env settings.
Verify JWT_SECRET consistency across services.
Ensure ports 5001 and 5002 are free.

