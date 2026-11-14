# Kubernetes Deployment Platform

A containerized full-stack application deployed on Kubernetes (k3s) running on Azure. The project demonstrates containerization, Kubernetes orchestration, Helm-based deployments, Ingress routing, and multi-replica application management.

## Architecture

```text
                   Internet
                      |
                Azure Public IP
                      |
                Traefik Ingress
                      |
              React Frontend Service
                      |
              Frontend Deployment
                (2 Replicas)
                      |
                Nginx Proxy
                      |
               FastAPI Service
                      |
               Backend Deployment
                (2 Replicas)
```

Both frontend and backend are deployed independently and managed through separate Helm charts.

## Tech Stack

| Category               | Technologies       |
| ---------------------- | ------------------ |
| Cloud                  | Microsoft Azure    |
| Infrastructure as Code | Terraform          |
| Operating System       | Ubuntu 24.04       |
| Containerization       | Docker             |
| Orchestration          | Kubernetes (k3s)   |
| Package Management     | Helm               |
| Ingress Controller     | Traefik            |
| Frontend               | React, Vite, Nginx |
| Backend                | Python, FastAPI    |
| Version Control        | Git, GitHub        |

## Application

The project includes a Task Management application.

**Frontend**

- Create tasks.
- View existing tasks.
- Mark tasks as completed.
- Delete tasks.

**Backend API**

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/`                | API welcome message      |
| GET    | `/health`          | Health check             |
| POST   | `/tasks`           | Create a task            |
| GET    | `/tasks`           | Retrieve all tasks       |
| GET    | `/tasks/{task_id}` | Retrieve a specific task |
| PUT    | `/tasks/{task_id}` | Update task completion   |
| DELETE | `/tasks/{task_id}` | Delete a task            |

## Deployment

The following commands assume the Azure VM and k3s cluster have already been provisioned.

### 1. Build Docker Images

Backend:

```bash
docker build -t task-api:v1 ./app
```

Frontend:

```bash
docker build -t task-frontend:v1 ./frontend
```

### 2. Import Images into k3s

```bash
docker save task-api:v1 -o task-api.tar
sudo k3s ctr images import task-api.tar

docker save task-frontend:v1 -o task-frontend.tar
sudo k3s ctr images import task-frontend.tar
```

### 3. Deploy Applications Using Helm

Deploy the backend:

```bash
helm upgrade --install task-api ./task-api
```

Deploy the frontend:

```bash
helm upgrade --install task-frontend ./task-frontend
```

### 4. Verify Deployments

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress
```

### 5. Access the Application

Open the Azure VM public IP in a browser:

```text
http://YOUR_VM_PUBLIC_IP/
```

API health check:

```bash
curl http://YOUR_VM_PUBLIC_IP/api/health
```

## Current Deployment

| Component           | Configuration       |
| ------------------- | ------------------- |
| Kubernetes          | k3s                 |
| Frontend replicas   | 2                   |
| Backend replicas    | 2                   |
| Frontend service    | ClusterIP           |
| Backend service     | ClusterIP           |
| Ingress             | Traefik             |
| Application routing | Nginx reverse proxy |

## Future Improvements

- Integrate PostgreSQL for shared, persistent application data.
