import { Dispatch } from 'redux';
import { AsyncActionCreator } from 'typesafe-actions';

type AnyAsyncActionCreator = AsyncActionCreator<any, any, any>;

export default function createAsyncThunk<A extends AnyAsyncActionCreator, F extends (...params: any[]) => Promise<any>>(
  asyncActionCreator: A,
  promiseCreator: F
) {
  type Params = Parameters<F>;
  return function thunk(...params: Params) {
    return async (dispatch: Dispatch) => {
      const { request, success, failure } = asyncActionCreator;
      dispatch(request(undefined)); // 파라미터를 비우면 타입 에러가 나기 때문에 undefined 전달
      try {
        const result = await promiseCreator(...params);
        dispatch(success(result));
      } catch (e) {
        dispatch(failure(e));
      }
    };
  };
}
