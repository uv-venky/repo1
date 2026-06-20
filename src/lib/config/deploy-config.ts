import type { DeployConfigMap } from 'venky-core/common';

export const AWS_REGION = 'us-east-1';

export const GITHUB_REPO_NAME = 'uv-venky/repo1';

export const deployConfig: DeployConfigMap = {
  DEV: {
    clusterName: 'repo1-dev-cluster',
    serviceName: 'repo1-dev-service',
    label: 'Development',
  },
};
