Internet
  |
  v
Route 53 (later)
  |
  v
Elastic IP
  |
  v
EC2 (Ubuntu)
  |
  +-- Docker / k3s later
  +-- pulls images from ECR
  +-- reads config from Parameter Store
  +-- managed via Session Manager
  |
  v
MongoDB Atlas

Internet
  |
  v
EC2 public IP :80
  |
  v
frontend nginx container
  ├── serves React app
  ├── proxies /api -> backend container:3000
  └── proxies /socket.io -> backend container:3000
                           |
                           v
                      MongoDB Atlas

Internet
  |
  v
EC2 Public / Elastic IP
  |
  v
k3s
  |
  v
Traefik Ingress
  |---- /        -> client service -> client pod
  |---- /api     -> server service -> server pod
  |---- /socket.io -> server service -> server pod
                          |
                          v
                     MongoDB Atlas