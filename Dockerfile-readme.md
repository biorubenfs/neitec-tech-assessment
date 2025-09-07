# Docker Instructions

## Create de docker image

```bash
docker build -t neitec-tech-assessment .
```

## Run App in a Container

```bash
docker run -d --name nest-app -p 4000:4000 --env-file .env neitec-tech-assesment
```