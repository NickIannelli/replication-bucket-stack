#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ReplicationBucketStack } from './lib/replication-bucket-stack';

const app = new cdk.App();

const accountId = process.env.TARGET_ACCOUNT_ID;

if (!accountId) {
  console.error(`Please specify a target account ID to deploy to via
  
  TARGET_ACCOUNT_ID=9999999999 npm run deploy`);
} else {
  new ReplicationBucketStack(app, `replication-bucket-stack-${accountId}`, {
    targetAccountId: accountId,
  });
}