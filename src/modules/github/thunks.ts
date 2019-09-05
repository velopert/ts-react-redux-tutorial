import { getUserProfile } from '../../api/github';
import { getUserProfileAsync } from './actions';
import createAsyncThunk from '../../lib/createAsyncThunk';

export const getUserProfileThunk = createAsyncThunk(getUserProfileAsync, getUserProfile);
