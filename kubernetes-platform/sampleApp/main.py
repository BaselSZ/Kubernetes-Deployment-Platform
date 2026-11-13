from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from uuid import uuid4

app = FastAPI(
    title="Task Management API",
    description="A sample API deployed on Kubernetes",
    version="1.0.0"
)

tasks = {}


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None


class Task(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    completed: bool = False


@app.get("/")
def root():
    return {"message": "Task Management API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/tasks", response_model=Task)
def create_task(task: TaskCreate):
    task_id = str(uuid4())

    new_task = Task(
        id=task_id,
        title=task.title,
        description=task.description
    )

    tasks[task_id] = new_task
    return new_task


@app.get("/tasks")
def get_tasks():
    return list(tasks.values())


@app.get("/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")

    return tasks[task_id]


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, completed: bool):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")

    tasks[task_id].completed = completed
    return tasks[task_id]


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")

    del tasks[task_id]
    return {"message": "Task deleted"}