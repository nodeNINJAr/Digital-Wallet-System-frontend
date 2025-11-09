import { useVerifyUserQuery } from '@/redux/services/api';
import { clearUser, setUser } from '@/redux/slice/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';


export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useVerifyUserQuery();
  useEffect(() => {
    if (isLoading) return;

    if (data?.data) {
      dispatch(setUser(data.data));
    } else {
      dispatch(clearUser());
    }
  }, [data, error, isLoading, dispatch]);

  return <>{children}</>;
}
