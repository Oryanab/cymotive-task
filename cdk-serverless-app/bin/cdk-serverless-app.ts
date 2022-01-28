#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkServerlessAppStack } from '../lib/cdk-serverless-app-stack';

const app = new cdk.App();
new CdkServerlessAppStack(app, 'CdkServerlessAppStack');
