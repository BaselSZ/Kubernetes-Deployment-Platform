# Kubernetes Deployment Platform

A hands-on DevOps project demonstrating infrastructure provisioning, containerization, Kubernetes orchestration, and application deployment using Azure, Terraform, Docker, k3s, Helm, and Traefik.

## Architecture

```text
                 Internet
                    |
                    v
             Azure Public IP
                    |
                    v
             Traefik Ingress
                    |
                    v
             Kubernetes Service
                    |
             +------+------+
             |             |
             v             v
          Pod 1           Pod 2
             |             |
             +------+------+
                    |
                    v
             FastAPI Task API
```

**Infrastructure:**

- Azure Virtual Machine running Ubuntu 24.04
- Infrastructure provisioned using Terraform
- Single-node Kubernetes cluster using k3s

## Tech Stack

| Category               | Technologies     |
| ---------------------- | ---------------- |
| Cloud                  | Microsoft Azure  |
| Infrastructure as Code | Terraform        |
| Operating System       | Ubuntu Linux     |
| Containerization       | Docker           |
| Orchestration          | Kubernetes (k3s) |
| Package Management     | Helm             |
| Ingress Controller     | Traefik          |
| Application            | Python, FastAPI  |
| Version Control        | Git, GitHub      |

## Application

The project includes a sample Task Management REST API built with FastAPI.

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/`                | API welcome message           |
| GET    | `/health`          | Health check                  |
| POST   | `/tasks`           | Create a task                 |
| GET    | `/tasks`           | Retrieve all tasks            |
| GET    | `/tasks/{task_id}` | Retrieve a specific task      |
| PUT    | `/tasks/{task_id}` | Update task completion status |
| DELETE | `/tasks/{task_id}` | Delete a task                 |

## Deployment

### Prerequisites

- Azure subscription
- Terraform
- Azure CLI
- SSH client
- Docker
- kubectl
- Helm

### 1. Provision Infrastructure

Navigate to the Terraform directory:

```bash
cd terraform
terraform init
terraform validate
terraform plan
terraform apply
```

### 2. Connect to the VM

```bash
ssh azureuser@YOUR_VM_PUBLIC_IP
```

### 3. Install Kubernetes

Install k3s:

```bash
curl -sfL https://get.k3s.io | sh -
```

Verify the cluster:

```bash
sudo kubectl get nodes
sudo kubectl get pods -A
```

### 4. Build the Docker Image

```bash
cd ~/kubernetes-platform/app
docker build -t task-api:v1 .
```

Import the image into k3s:

```bash
docker save task-api:v1 -o task-api.tar
sudo k3s ctr images import task-api.tar
```

### 5. Deploy Using Helm

```bash
cd ~/kubernetes-platform/task-api

helm lint .
helm install task-api .
```

Verify the deployment:

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
```

