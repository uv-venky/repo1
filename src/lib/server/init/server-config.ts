import type { Session, User } from 'venky-core/auth';
import type { ServerConfig } from 'venky-core/types';
import type { ActionRegistry } from 'venky-core/server';
import { teams } from '@/components/sidebar/moduleIndex';
import { ACTIONS, ACTION_ACCESS_ROLES, WORKFLOW_CALLABLE_ACTIONS } from '../actions';
import { DataSources } from '../ds/defs';
import relayStateProcessors from './relay-state-processors';
import { deployConfig, AWS_REGION, GITHUB_REPO_NAME } from '../../config/deploy-config';

export function validateAccess(_: { session: Session; headers: Headers }): void {}

export function validateProfileUpdate(_key: string, _value: string | boolean | undefined, _user: User): void {}

const serverConfig: ServerConfig = {
  validateAccess,
  validateProfileUpdate,
  teams,
  dataSources: DataSources,
  jobs: [],
  chatAgents: {},
  templateCodeGenFunctions: [],
  relayStateProcessors,
  deployConfig,
  awsRegion: AWS_REGION,
  gitHubRepoName: GITHUB_REPO_NAME,
  actionRegistry: {
    ACTIONS: ACTIONS as ActionRegistry['ACTIONS'],
    ACTION_ACCESS_ROLES: ACTION_ACCESS_ROLES as ActionRegistry['ACTION_ACCESS_ROLES'],
    WORKFLOW_CALLABLE_ACTIONS,
  },
  newUserEmailSubject: 'Welcome to Repo1',
  newUserEmailSubjectInternal: 'Welcome to Repo1',
};

export default serverConfig;
