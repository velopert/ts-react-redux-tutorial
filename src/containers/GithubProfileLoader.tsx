import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../modules';
import GithubUsernameForm from '../components/GithubUsernameForm';
import GithubProfileInfo from '../components/GithubProfileInfo';
import { getUserProfileAsync } from '../modules/github';

function GithubProfileLoader() {
  const { data, loading, error } = useSelector((state: RootState) => state.github.userProfile);
  const dispatch = useDispatch();

  const onSubmitUsername = (username: string) => {
    dispatch(getUserProfileAsync.request(username));
  };

  return (
    <>
      <GithubUsernameForm onSubmitUsername={onSubmitUsername} />
      {loading && <p style={{ textAlign: 'center' }}>로딩중..</p>}
      {error && <p style={{ textAlign: 'center' }}>에러 발생!</p>}
      {data && <GithubProfileInfo bio={data.bio} blog={data.blog} name={data.name} thumbnail={data.avatar_url} />}
    </>
  );
}

export default GithubProfileLoader;
