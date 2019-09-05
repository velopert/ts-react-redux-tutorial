import { Dispatch, AnyAction } from 'redux';

// 다양한 액션 생성 함수를 사용 할 수 있게 해줍니다.
// ...params: any[] 는 어떤 파라미터든 받아올 수 있게 해주고
// AnyAction은 아무 형태의 액션 객체를 만들어낼 수 있다는 것을 의미합니다.
type AsyncActionCreator = {
  request: (...params: any[]) => AnyAction;
  success: (...params: any[]) => AnyAction;
  failure: (...params: any[]) => AnyAction;
  cancel: (...params: any[]) => AnyAction;
};

// Generic에 extends AsyncActionCreator 를 사용함으로써 asyncActionCreator의 타입이 AsyncACtionCreator 라는걸 명시 해줄 수 있습니다.
// 이 작업을 하지 않으면 request / success / failure 를 사용 할 수 없습니다.
export default function createAsyncThunk<A extends AsyncActionCreator, F extends (...params: any[]) => Promise<any>>(
  asyncActionCreator: A,
  promiseCreator: F
) {
  type Params = Parameters<F>;
  return function thunk(...params: Params) {
    return async (dispatch: Dispatch) => {
      const { request, success, failure } = asyncActionCreator;
      dispatch(request());
      try {
        const result = await promiseCreator(...params);
        dispatch(success(result));
      } catch (e) {
        dispatch(failure(e));
      }
    };
  };
}
