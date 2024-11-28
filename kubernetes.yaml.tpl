apiVersion: apps/v1
kind: Deployment
metadata:
  name: markdown-blog-backend
  labels:
    app: markdown-blog-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: markdown-blog-backend
  template:
    metadata:
      labels:
        app: markdown-blog-backend
    spec:
      containers:
      - name: markdown-blog-backend
        image: us-west2-docker.pkg.dev/GOOGLE_CLOUD_PROJECT/markdown-blog/markdown-blog:COMMIT_SHA
        ports:
        - containerPort: 5000
---
kind: Service
apiVersion: v1
metadata:
  name: markdown-blog-backend-service
spec:
  selector:
    app: markdown-blog-backend
  ports:
  - protocol: TCP
    port: 5000
    targetPort: 5000
  type: LoadBalancer
