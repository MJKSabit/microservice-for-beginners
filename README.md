# Microservice For Beginners

## Microservices

Microservice, a word that is often heard in the tech world. You need scalable solution? Upgrade to microservice. You need to control individual modules? Upgrade to microservice. But with fewer amount of resources available with proper guidelines to truly implement microservice, there is unforeseen headache in all the way.

Most of us think microservice as different backend instances running for different module. It's just tip of the iceberg. There is much more to this architecture than just splitting the backend into different parts. To harness the power of microservice, we need to think in a distributed manner, rather than the traditional approach. It includes separation of datasource, interservice communication, managing these individual services, separation of authentication and authorization, and many more.

In the upcoming series of blog, I will try to explain the common problems that we faced during my time at Pridesys IT Ltd. trying to implement microservice and what are the approaches we followed to overcome that. 

List of topics that will be covered in this series:

1. [Authentication and Authorization](./0-auth)
    - [Docker Compose](./0-auth/README.md)
    - [Kubernetes](./0-auth/README.md)
2. Fine-grained Access Control
3. Inter-service Communication
4. Data Consistency
