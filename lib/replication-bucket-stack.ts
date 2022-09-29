import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import { ArnPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Bucket, BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export interface ReplicationBucketStackProps extends cdk.StackProps {
  targetAccountId: string;
}

export class ReplicationBucketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ReplicationBucketStackProps) {
    super(scope, id, props);
    
    const bucket = new Bucket(this, 'replication-bucket', {
      encryption: BucketEncryption.KMS_MANAGED,
      enforceSSL: true,
      versioned: true,
    });

    bucket.addToResourcePolicy(new PolicyStatement(
      {
        sid: "Permissions on objects and buckets",
        effect: Effect.ALLOW,
        principals: [
          new ArnPrincipal(`arn:aws:iam::${props.targetAccountId}:role/bucket-replication-role`),
        ],
        actions: [
            "s3:List*",
            "s3:GetBucketVersioning",
            "s3:PutBucketVersioning",
            "s3:ReplicateDelete",
            "s3:ReplicateObject"
        ],
        resources: [
          bucket.bucketArn,
          bucket.arnForObjects('*')
        ]
    }));

    bucket.addToResourcePolicy(new PolicyStatement({
      sid: "Permission to override bucket owner",
      effect: Effect.ALLOW,
      principals: [
        new ArnPrincipal(`arn:aws:iam::${props.targetAccountId}:root`)
      ],
      actions: [
        "s3:ObjectOwnerOverrideToBucketOwner"
      ],
      resources: [
        bucket.bucketArn,
        bucket.arnForObjects('*')
      ]
    }));

    new CfnOutput(this, 'details', {
      value: JSON.stringify({ bucketArn: bucket.bucketArn, accountId: this.account }, null, 2),
      description: `The details for the replication provider`
    })
  }
}
