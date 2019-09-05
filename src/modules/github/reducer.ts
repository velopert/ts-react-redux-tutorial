import { createReducer } from 'typesafe-actions';
import { GithubState, GithubAction } from './types';
import { getUserProfileAsync } from './actions';
import { asyncState, createAsyncReducer } from '../../lib/reducerUtils';

const initialState: GithubState = {
  userProfile: asyncState.initial()
};

const github = createReducer<GithubState, GithubAction>(initialState).handleAction(
  [getUserProfileAsync.request, getUserProfileAsync.success, getUserProfileAsync.failure],
  createAsyncReducer(getUserProfileAsync, 'userProfile')
);

export default github;
