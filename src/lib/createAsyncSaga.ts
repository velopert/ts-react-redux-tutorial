import { call, put } from 'redux-saga/effects';
import { AsyncActionCreator } from 'typesafe-actions';

type AnyAsyncActionCreator = AsyncActionCreator<any, any, any>;
type PromiseCreatorFunction<P, T> = (payload: P) => Promise<T>;

/* 
  유틸함수의 재사용성을 높이기 위하여 함수의 파라미터는 언제나 하나의 값을 사용하도록 하고,
  action.payload 를 그대로 파라미터로 넣어주도록 설정합니다.
  만약에 여러가지 종류의 값을 파라미터로 넣어야 한다면 객체 형태로 만들어줘야 합니다.
*/

export default function createAsyncSaga<AC extends AnyAsyncActionCreator, P, T>(
  asyncActionCreator: AC,
  promiseCreator: PromiseCreatorFunction<P, T>
) {
  return function* saga(action: ReturnType<typeof asyncActionCreator.request>) {
    try {
      const result = yield call(promiseCreator, action.payload);
      yield put(asyncActionCreator.success(result));
    } catch (e) {
      yield put(asyncActionCreator.failure(e));
    }
  };
}
