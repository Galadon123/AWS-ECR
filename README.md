### Create an IAM role for the AWS LoadBalancer Controller and attach the role to the Kubernetes service account
- Applicable only with eksctl managed clusters
- This command will create an AWS IAM role
- This command also will create Kubernetes Service Account in k8s cluster
- In addition, this command will bound IAM Role created and the Kubernetes service account created
- 
### Create IAM Role using eksctl
# Verify if any existing service account
```bash
kubectl get sa -n kube-system

kubectl get sa aws-load-balancer-controller -n kube-system
```

#### Obseravation:
1. Nothing with name "aws-load-balancer-controller" should exist
```bash
kubectl get sa -n kube-system

kubectl get sa aws-load-balancer-controller -n kube-system
```
#### Obseravation:
1. Nothing with name "aws-load-balancer-controller" should exist

# Template
```bash
eksctl create iamserviceaccount \
  --cluster=my_cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \ 
  --attach-policy-arn=arn:aws:iam::111122223333:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --approve
```

### Install the AWS Load Balancer Controller using Helm V3

```
Install Helm
Install Helm if not installed
Install Helm for AWS EKS
```
#### Install Helm (if not installed) windows
```bash
 choco install kubernetes-helm
```
#### Verify Helm version
helm version
# Add the eks-charts repository.
helm repo add eks https://aws.github.io/eks-charts

# Update your local repo to make sure that you have the most recent charts.
helm repo update

### Install the AWS Load Balancer Controller.
```bash
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=<cluster-name> \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller \
  --set region=<region-code> \
  --set vpcId=<vpc-xxxxxxxx> \
  --set image.repository=<account>.dkr.ecr.<region-code>.amazonaws.com/amazon/aws-load-balancer-controller
```
