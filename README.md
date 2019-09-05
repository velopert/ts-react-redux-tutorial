# ts-react-redux-tutorial

> [velog](https://velog.io/recent) 에 이에 관한 포스트가 조만간 올라올 예정입니다.

타입스크립트를 사용하는 리액트 프로젝트에서 리덕스를 프로처럼 사용해봅시다!

이 프로젝트는 총 10개의 브랜치로 나뉘어져있습니다.

1. **[basics/counter](https://github.com/velopert/ts-react-redux-tutorial/tree/basics/counter/src)**: 가장 기본적인 카운터 예시입니다
2. **[basics/todos](https://github.com/velopert/ts-react-redux-tutorial/blob/basics/todos/src/modules/todos.ts)**: 조금 더 다양한 액션을 다루는 투두리스트 예시입니다
3. **[refactor/counter](https://github.com/velopert/ts-react-redux-tutorial/blob/refactor/counter/src/modules/counter.ts)**: 카운터 리덕스 모듈을 [typesafe-actions](https://github.com/piotrwitek/typesafe-actions) 를 사용하여 리팩토링하는 예시입니다.
4. **[refactor/counter2](https://github.com/velopert/ts-react-redux-tutorial/blob/refactor/counter2/src/modules/counter.ts)**: 카운터 리듀서를 typesafe-actions의 `createReducer` 함수를 사용하여 메서드 체이닝 방식을 사용하여 리팩토링하는 예시입니다.
5. **[refactor/todos](https://github.com/velopert/ts-react-redux-tutorial/blob/refactor/todos/src/modules/todos.ts)**: 투두리스트 리덕스 모듈을 typesafe-actions 로 리팩토링한 예시입니다.
6. **[refactor/todos2](https://github.com/velopert/ts-react-redux-tutorial/tree/refactor/todos2/src/modules/todos)**: 투두리스트 리덕스 모듈을 여러개의 파일로 분리하여 리팩토링한 예시입니다.
7. **[middleware/thunk](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/thunk/src/modules/github/thunks.ts)**: redux-thunk 미들웨어를 사용하는 예시입니다.
8. **[middleware/thunk-refactor](https://github.com/velopert/ts-react-redux-tutorial/tree/middleware/thunk-refactor/src/lib)**: 비동기 작업을 관리하는 thunk 함수와, 비동기 관련 액션에 따라 상태를 업데이트하는 리듀서를 조금 더 짧은 코드로 구현 할 수 있도록 `createAsyncThunk` 와 `createAsyncReducer` 유틸 함수를 만들어서 코드를 리팩토링하는 예시입니다.
9. **[middleware/saga](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/saga/src/modules/github/sagas.ts)**: redux-saga 미들웨어를 사용하는 예시입니다
10. **[middleware/saga-refactor](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/saga-refactor/src/lib/createAsyncSaga.ts)**: Promise 를 기반으로 액션을 발생시키는 saga 를 쉽게 만들어주는 `createAsyncSaga` 유틸 함수를 만들어서 코드를 리팩토링하는 예시입니다.

## Highlights

주목할만한 코드는 다음과 같습니다.

### 기초

**액션 타입**을 선언 할 때에는 다음과 같이 선언합니다.

```javascript
const INCREASE_BY = 'counter/INCREASE_BY' as const;
```

`as const` 를 함으로써 추후 액션 객체의 타입을 유추 할 수 있게 됩니다.

**액션 생성 함수**를 만들 떄에는 다음과 같이 선언합니다.

```javascript
export const increaseBy = (diff: number) => ({
  type: INCREASE_BY,
  payload: diff
});
```

그리고, 리듀서를 구현하기 전에 **모든 액션들에 대한 타입**을 하나의 type alias 에 담아주어야 되는데요 이는 이렇게 작성합니다.

<!-- prettier-ignore -->
```javascript
type CounterAction =
  | ReturnType<typeof increase>
  | ReturnType<typeof decrease>
  | ReturnType<typeof increaseBy>;
```

다음, 리듀서에서 관리 할 상태와 초깃값은 다음과 같이 선언합니다.

```javascript
// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type CounterState = {
  count: number
};

// 초기상태를 선언합니다.
const initialState: CounterState = {
  count: 0
};
```

**리듀서**는 다음과 같이 구현합니다.

```javascript
function counter(state: CounterState = initialState, action: CounterAction): CounterState {
  switch (action.type) {
    case INCREASE: // case 라고 입력하고 Ctrl + Space 를 누르면 어떤 종류의 action.type들이 있는지 확인 할 수 있습니다.
      return { count: state.count + 1 };
    case DECREASE:
      return { count: state.count - 1 };
    case INCREASE_BY:
      return { count: state.count + action.payload };
    default:
      return state;
  }
}
```

그리고 루트 리듀서와 **루트 상태**는 다음과 같이 만듭니다.

```javascript
import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
  counter
});

// 루트 리듀서를 내보내주세요.
export default rootReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;
```

**컨테이너**는 다음과 같이 만듭니다.

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../modules';
import { increase, decrease, increaseBy } from '../modules/counter';
import Counter from '../components/Counter';

export interface CounterContainerProps {}

const CounterContainer = (props: CounterContainerProps) => {
  // 상태를 조회합니다. 상태를 조회 할 때에는 state 의 타입을 RootState 로 지정해야합니다.
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다

  // 각 액션들을 디스패치하는 함수들을 만들어줍니다
  const onIncrease = () => {
    dispatch(increase());
  };

  const onDecrease = () => {
    dispatch(decrease());
  };

  const onIncreaseBy = (diff: number) => {
    dispatch(increaseBy(diff));
  };

  return <Counter count={count} onIncrease={onIncrease} onDecrease={onDecrease} onIncreaseBy={onIncreaseBy} />;
};

export default CounterContainer;
```

> 여기 까지의 코드들은 **[basics/counter](https://github.com/velopert/ts-react-redux-tutorial/tree/basics/counter/src)** 브랜치에서 볼 수 있습니다.

### typesafe-actions 사용하기

typesafe-actions](https://github.com/piotrwitek/typesafe-actions) 를 사용 할 때는 **액션 타입**과 **액션 생성 함수**를 다음과 같이 작성합니다.

```javascript
// 액션 type 선언
const INCREASE = 'counter/INCREASE';
const DECREASE = 'counter/DECREASE';
const INCREASE_BY = 'counter/INCREASE_BY';

// 액션 생성함수를 선언합니다
export const increase = createStandardAction(INCREASE)();
export const decrease = createStandardAction(DECREASE)();
export const increaseBy = createStandardAction(INCREASE_BY)<number>(); // payload 타입을 Generics 로 설정해주세요.
```

액션 타입을 선언 할 때 `as const` 를 빼셔도 됩니다.

**모든 액션들에 대한 타입**은 이렇게 구현 할 수 있습니다.

```javascript
// 액션 객체 타입 준비
const actions = { increase, decrease, increaseBy }; // 모든 액션 생성함수들을 actions 객체에 넣습니다
type CounterAction = ActionType<typeof actions>; // ActionType 를 사용하여 모든 액션 객체들의 타입을 준비해줄 수 있습니다
```

**리듀서**는 이렇게 작성 할 수 있습니다.

```javascript
const counter = createReducer<CounterState, CounterAction>(initialState, {
  [INCREASE]: state => ({ count: state.count + 1 }), // 액션을 참조 할 필요 없으면 파라미터로 state 만 받아와도 됩니다
  [DECREASE]: state => ({ count: state.count - 1 }),
  [INCREASE_BY]: (state, action) => ({ count: state.count + action.payload }) // 액션의 타입을 유추 할 수 있습니다.
});
```

> 여기까지의 코드는 [refactor/counter](https://github.com/velopert/ts-react-redux-tutorial/blob/refactor/counter/src/modules/counter.ts) 브랜치에서 볼 수 있습니다.

리듀서를 **메서드 체이닝 방식**을 사용한다면 다음과 같이 구현 할 수 있습니다.

```javascript
const counter = createReducer(initialState)
  .handleAction(increase, state => ({ count: state.count + 1 }))
  .handleAction(decrease, state => ({ count: state.count - 1 }))
  .handleAction(increaseBy, (state, action) => ({
    count: state.count + action.payload
  }));
```

> 이 코드는 [refactor/counter2](https://github.com/velopert/ts-react-redux-tutorial/blob/refactor/counter2/src/modules/counter.ts) 에서 확인 할 수 있습니다.

### 파일 분리하기

리덕스 관련 코드를 [Ducks 패턴](https://github.com/erikras/ducks-modular-redux)으로 작성하다가 액션의 갯수가 너무 많아져서 코드가 길어지면 한 디렉터리에 actions, reducer, types 를 분리해서 작성하시는 것도 좋은 방법입니다.

```
modules/
  todos/
    index.ts
    actions.ts
    reducer.ts
    types.ts
```

이에 대한 코드는 [refactor/todos2](https://github.com/velopert/ts-react-redux-tutorial/tree/refactor/todos2/src/modules/todos) 에서 확인 할 수 있습니다.

index.ts 는 다음과 같이 작성합니다.

```javascript
export { default } from './reducer'; // reducer 를 불러와서 default로 내보내겠다는 의미
export * from './actions'; // 모든 액션 생성함수들을 불러와서 같은 이름들로 내보내겠다는 의미
export * from './types'; // 모든 타입들을 불러와서 같은 이름들로 내보내겠다는 의미
```

### redux-thunk 사용하기

**비동기 작업 관련 액션 생성 함수**는 typesafe-actions의 `createAsyncAction`를 사용하면 편하게 구현 할 수 있습니다.

```javascript
import { createAsyncAction } from 'typesafe-actions';
import { GithubProfile } from '../../api/github';
import { AxiosError } from 'axios';

export const GET_USER_PROFILE = 'github/GET_USER_PROFILE';
export const GET_USER_PROFILE_SUCCESS = 'github/GET_USER_PROFILE_SUCCESS';
export const GET_USER_PROFILE_ERROR = 'github/GET_USER_PROFILE_ERROR';

export const getUserProfileAsync = createAsyncAction(
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_ERROR
)<undefined, GithubProfile, AxiosError>();
```

**Thunk** 함수를 만들 때는 다음과 같이 작성합니다.

```javascript
import { ThunkAction } from 'redux-thunk';
import { RootState } from '..';
import { GithubAction } from './types';
import { getUserProfile } from '../../api/github';
import { getUserProfileAsync } from './actions';

// ThunkAction 의 Generics 에는 다음 값들을 순서대로 넣어줍니다.
/*
  1. thunk 함수에서 반환하는 값의 타입
  2. 리덕스 스토어의 상태 타입
  3. Extra Argument (https://github.com/reduxjs/redux-thunk#injecting-a-custom-argument)
  4. thunk 함수 내부에서 디스패치 할 수 있는 액션들의 타입
*/
export function getUserProfileThunk(username: string): ThunkAction<void, RootState, null, GithubAction> {
  return async dispatch => {
    const { request, success, failure } = getUserProfileAsync;
    dispatch(request());
    try {
      const userProfile = await getUserProfile(username);
      dispatch(success(userProfile));
    } catch (e) {
      dispatch(failure(e));
    }
  };
}
```

> thunk 관련 코드는 **[middleware/thunk](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/thunk/src/modules/github/thunks.ts)** 브랜치에서 확인 할 수 있습니다.

### thunk 와 비동기 작업을 위한 상태 관리 리팩토링

[`createAsyncThunk`](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/thunk-refactor/src/lib/createAsyncThunk.ts) 와 [`reducerUtils`](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/thunk-refactor/src/lib/reducerUtils.ts) 유틸 함수들을 만들어서 사용하게 된다면,

**thunk 함수**는 다음과 같이 작성 할 수 있고

```javascript
export const getUserProfileThunk = createAsyncThunk(getUserProfileAsync, getUserProfile);
```

**리듀서**는 다음과 같이 작성 할 수 있습니다.

```javascript
const github = createReducer<GithubState, GithubAction>(initialState).handleAction(
  transformToArray(getUserProfileAsync),
  createAsyncReducer(getUserProfileAsync, 'userProfile')
);
```

> 이에 대한 코드는 [middleware/thunk-refactor](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/thunk-refactor/src) 에서 확인 하실 수 있습니다.

### redux-saga 사용하기

saga 는 다음과 같이 작성합니다.

```javascript
import { getUserProfileAsync, GET_USER_PROFILE } from './actions';
import { getUserProfile, GithubProfile } from '../../api/github';
import { call, put, takeEvery } from 'redux-saga/effects';

function* getUserProfileSaga(action: ReturnType<typeof getUserProfileAsync.request>) {
  try {
    const userProfile: GithubProfile = yield call(getUserProfile, action.payload);
    yield put(getUserProfileAsync.success(userProfile));
  } catch (e) {
    yield put(getUserProfileAsync.failure(e));
  }
}

export function* githubSaga() {
  yield takeEvery(GET_USER_PROFILE, getUserProfileSaga);
}
```

> saga 를 적용한 코드는 [middleware/saga](https://github.com/velopert/ts-react-redux-tutorial/tree/middleware/saga/src/modules/github) 브랜치에서 확인 할 수 있습니다.

### saga 리팩토링

프로미스를 다루는 saga 를 쉽게 만들어주는 함수 [`createAsyncSaga`](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/saga-refactor/src/lib/createAsyncSaga.ts)를 만들면

API 요청에 대한 saga 를 만들 때 다음과 같이 한 줄로 작성 할 수 있습니다.

```javascript
const getUserProfileSaga = createAsyncSaga(getUserProfileAsync, getUserProfile);
```

> 이에 대한 코드는 [saga-refactor](https://github.com/velopert/ts-react-redux-tutorial/blob/middleware/saga-refactor/src/lib/createAsyncSaga.ts) 브랜치에서 보실 수 있습니다.
