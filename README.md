# Replication Bucket Stack

This is a simple project to create an S3 bucket with permissions for any given account ID to replicate files into it.

## Getting started

1. First, clone the repo locally

2. After the repo has been cloned, the dependencies need to be installed via

```bash
npm install
```

3. (Optional) If you have not deployed CDK to your target AWS account previously, you will need to run `npx cdk bootstrap`

4. Deploy the stack, with a target account ID (update the 9999999999 in the below to whichever account is required)

```bash
TARGET_ACCOUNT_ID=9999999999 npm run deploy
```

5. Provide the output at the end of the deployment to your provider so they can replicate files to you
