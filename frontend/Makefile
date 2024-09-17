# Variables
DOCKER_USERNAME = fazlulkarim105925
IMAGE_NAME = frontend
TAG ?= v2.1

# Build the Docker image
build:
	docker build -t $(IMAGE_NAME):$(TAG) .

# Tag the Docker image
tag:
	docker tag $(IMAGE_NAME):$(TAG) $(DOCKER_USERNAME)/$(IMAGE_NAME):$(TAG)

# Push the Docker image to Docker Hub (or your preferred registry)
push:
	docker push $(DOCKER_USERNAME)/$(IMAGE_NAME):$(TAG)

# Combined command to build, tag, and push the Docker image
all: build tag push

# Clean up local images (optional)
clean:
	docker rmi $(IMAGE_NAME):$(TAG) $(DOCKER_USERNAME)/$(IMAGE_NAME):$(TAG)

.PHONY: build tag push all clean
