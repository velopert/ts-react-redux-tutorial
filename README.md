# ts-react-redux-tutorial

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

> 준비중~
