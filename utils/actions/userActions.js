import { getMe } from '../../api/auth';

export const getUserData = async (token) => {
  const { err, data } = await getMe(token);
  if (err) {
    console.log(err);
    return;
  }

  return data?.data;
};
