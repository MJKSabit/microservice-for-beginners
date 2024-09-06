# Microservice Auth for Beginners

## Microservices

Microservice, a word that is often heard in the tech world. You need scalable solution? updrage to microsrevice. You need to control individual modules? upgrade to microservice. But with less amount of resources available with proper guidelines to truly implement microservice, there is unforeseen headache in all the way.

Most of us think microservice as different backend instances running for different module. Its just tip of the iceberg. There is so much more in this architecture other than splitting the backend into diffenet parts. To harness the power of microservice, we need to think in a distributed manner, rather than the treaditional approach. It includes separation of datasource, interservice communication, managing these individual services, separation of authentication and authoriazation, and many more.

In the upcoming series of blog, I will try to explain the common problem that we faced during my time at Pridesys IT Ltd trying to implement Microservice and how approached to overcome that. In todays blog, I will try to explain the authentication and authoriazation process in microservice for smooth operation.

## Auth - Authentication and Authorization

One of the most common part of any application is authentication and authorization. Authentication is identifying the user who is trying to access the application and authorization is checking if the user has permission to access/modify a resource. These two processes ensures system security by contolling what is accessible by whom, and combinedly we will refer these as **auth**.

In monolith web architecture, there is usually a middleware/interceptor that is responsible for handling auth and maintain secured API endpoints. For example, using spring security, we might need to use filters to verify ones identity and access at each request. HTTP protocol is stateless, that is no information is preserved from one call to another. For that reason, everytime before serving a request, authenticity is verified. That is true for all kinds of authentication - Basic, Session based or Token based.

In microservices, services are split up to different services. But ensuring security is common part for all of them. One might choose to add authentication handing at each services separately, but this is a very bad prectice. One of the core principle of clean coding is DRY.

>  **DRY** - Don't Repeat Yourself

If we need to change the implementation / refactor / fix security issues of our auth in future, we need to change code in each and every services, which is not feasable. 

For this reason, typically there exists atleast one service only to handle authentication & authorization. The implementation of this could be simple as basic auth or complex with many permissions and role-based authentication. But the issue that arises with this approach is how other microservices can use that auth service. 

One approach could be using REST API calls from other services to auth service to verify ones identity and access. But again, it will involve more complexity that needs to be addressed. Every microservice needs to have same kind of code for authentication. Moreover, if we use REST API call for interservice communication, there will be redundent auth checkup which will decrerease the overall performance of the system.

To mitigate thes issues, we divide our domain to two spaces - public and private; and an application gateway is used to conduct communication from public domain to private domain.

## Application Gateway

Application gateway is a separate server/service that works as a firewall to enable secured access to internal services. It can also be used to limit rate for particular IP. Again, since all external communication is routed via the application gateway, it could be a good place to integrate authentication and authorization. Communication inside the private domain is trusted, so no double checking is done for interservice communication. We can also keep some service truly private without exposing that using the application gateway, and it can only be used by other services. Application gateway is acts as a reverse proxy to communicate with the exact service that is needed from outside.

The idea behind the application gateway is simple, we can use our own implementation using any preferred language. One can use express.js or flask for that. But, we need to keep in mind that, all external communication is done via that application gateway. So, the server needs to handle combined load of the whole microservice. Implementation with single threaded high level language could introduce bottleneck in performance. And there could be security vulnerablities if not handled properly.

For that case, it is better to use a proven application gateway, and mostly used open source implemnetation is **NGINX**.

## NGINX

Nginx is a web server that can also be used as a reverse proxy, load balancer, mail proxy and HTTP cache. It is highly scalable, performant and widely used as application gateway. According to [one of the blogs](https://blog.nginx.org/blog/testing-the-performance-of-nginx-and-nginx-plus-web-servers) on performace testing, one nginx instance can handle more than *500,000 requests per second* for a typical response (1-10kB) in 8-16 core CPU.

In today's blog our main goal will be to use NGINX as application gatway with authentication support for a simple microservice application. It will be consisting two different deployment -

1. NGINX in docker compose

2. NGINX with ingress in kubernetes

NGINX uses a `conf` file to configure the web server. For the docker compose, we will directly modify the configuration file ourself. In case of kubernetes, we just need to add directives in the ingress manifest, and the NGINX ingress controller will be configured automatically.

Without further ado, lets dive into the implementation of microservice authentication.

## Microservices

We will use two simple microservices, built with expressjs to simulate microservice along with another auth service for basic authentication.

Initialize a nodejs application with expressjs

```bash
npm init -y
npm i express
```

Add three files for three services

1. `auth.js`
   
   ```js
   const express = require("express");
   const app = express();
   
   function authentication(req, res, next) {
       const authheader = req.headers.authorization;
       console.log(req.headers);
   
       if (!authheader) {
           let err = new Error('You are not authenticated!');
           res.setHeader('WWW-Authenticate', 'Basic');
           err.status = 401;
           return next(err)
       }
   
       const auth = new Buffer.from(authheader.split(' ')[1],
           'base64').toString().split(':');
       const user = auth[0];
       const pass = auth[1];
   
       if (user == 'admin' && pass == 'password') {
   
           // If Authorized user
           next();
       } else {
           let err = new Error('You are not authenticated!');
           res.setHeader('WWW-Authenticate', 'Basic');
           err.status = 401;
           return next(err);
       }
   
   }
   
   // First step is the authentication of the client
   app.use(authentication)
   app.use(express.static(path.join(__dirname, 'public')));
   
   // Server setup
   app.listen((3000), () => {
       console.log("Server is Running ");
   })
   ```




