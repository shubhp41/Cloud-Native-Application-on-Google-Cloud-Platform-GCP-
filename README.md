# Cloud-Native Application on Google Cloud Platform (GCP)

This project implements a cloud-native application on Google Cloud Platform (GCP), utilizing containerization, CI/CD pipeline, and Google Kubernetes Engine (GKE) for efficient deployment and management.

## Learning Outcomes

- Containerization: Containerized two microservices using Docker for easy deployment and scalability.
- CI/CD Pipeline: Implemented a CI/CD pipeline with GCP tools (Cloud Source Repository, Cloud Build) for automated building, testing, and deployment of the microservices.
- Kubernetes and GKE: Utilized Google Kubernetes Engine (GKE) to create and manage Kubernetes clusters, ensuring high availability and fault tolerance.
- Persistent Storage: Attached persistent volumes to the GKE cluster, enabling shared file storage for the microservices.
- REST APIs: Implemented REST APIs for seamless communication between the microservices, enhancing overall application functionality.

## Requirements

To run the project locally or deploy it on GCP, follow these steps:

1. Clone the repository to your local machine: `git clone <repository-url>`
2. Set up the required dependencies and tools, including Docker and the GCP SDK.
3. Build the Docker images for the microservices:
   - Microservice 1:
     - Change directory to `<microservice1-folder>`
     - Build the Docker image: `docker build -t <microservice1-image-name> .`
   - Microservice 2:
     - Change directory to `<microservice2-folder>`
     - Build the Docker image: `docker build -t <microservice2-image-name> .`
4. Push the Docker images to the GCP Artifact Registry (similar to Docker Hub):
   - Microservice 1: `docker push <gcr.io/repository>/<microservice1-image-name>`
   - Microservice 2: `docker push <gcr.io/repository>/<microservice2-image-name>`
5. Set up the CI/CD pipeline using GCP Cloud Build:
   - Connect the repository to Cloud Build and configure the build triggers.
   - Define the build steps, including building the Docker images, pushing them to the Artifact Registry, and deploying to GKE.
6. Create a GKE cluster using Terraform:
   - Install Terraform on your machine and set up the GCP credentials.
   - Navigate to the Terraform directory: `cd <terraform-directory>`
   - Initialize Terraform: `terraform init`
   - Create the GKE cluster: `terraform apply`
7. Deploy the microservices to the GKE cluster:
   - Apply the Kubernetes configuration: `kubectl apply -f <kubernetes-config-file>`
   - Verify the deployment: `kubectl get pods`
8. Test the application by making API calls to the microservices' endpoints.

