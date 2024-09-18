

#### **Step 1: Ensure the OIDC Provider is Associated**

For IRSA, ensure that your EKS cluster has the **OIDC provider** associated. This is needed to allow the Kubernetes service account to use IAM roles.

You can associate the OIDC provider with your EKS cluster by running:

```bash
eksctl utils associate-iam-oidc-provider --region $AWS_REGION --cluster $CLUSTER_NAME --approve
```

#### **Step 2: Create the AWS Load Balancer Controller Using Helm with IRSA**

Now, we will create the **AWS Load Balancer Controller** with a **Service Account** that automatically has the required IAM policy attached. This will use **IRSA** (IAM Roles for Service Accounts)

1. **Create the IAM Policy** (if it doesn't already exist):

   Download the necessary IAM policy for the AWS Load Balancer Controller:

   ```bash
   curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/main/docs/install/iam_policy.json
   ```

   Create the IAM policy in AWS:

   ```bash
   aws iam create-policy --policy-name AWSLoadBalancerControllerIAMPolicy --policy-document file://iam_policy.json
   ```

2. **Install the Controller Using Helm with IRSA:**

   Run the following command to install the AWS Load Balancer Controller with Helm, creating a service account and automatically attaching the required IAM policy:

   ```bash
   eksctl create iamserviceaccount \
     --name aws-load-balancer-controller \
     --namespace kube-system \
     --cluster $CLUSTER_NAME \
     --attach-policy-arn arn:aws:iam::<AWS_ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy \
     --approve \
     --override-existing-serviceaccounts
   ```

   Replace `<AWS_ACCOUNT_ID>` with your AWS account ID.

3. **Install the AWS Load Balancer Controller using Helm**:

   Now, install the AWS Load Balancer Controller using Helm and specify that it should use the service account we just created:

   ```bash
   helm repo add eks https://aws.github.io/eks-charts
   helm repo update

   helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
     -n kube-system \
     --set clusterName=$CLUSTER_NAME \
     --set serviceAccount.create=false \
     --set serviceAccount.name=aws-load-balancer-controller \
     --set region=$AWS_REGION \
     --set vpcId=$VPC_ID \
     --set image.repository=602401143452.dkr.ecr.$AWS_REGION.amazonaws.com/amazon/aws-load-balancer-controller
   ```