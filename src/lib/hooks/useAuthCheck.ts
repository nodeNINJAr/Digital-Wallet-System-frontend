import { useGetProfileQuery } from "@/redux/services/api";
import { clearCredentials, setCredentials, setLoading } from "@/redux/slice/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetProfileQuery();
    console.log("inside the hook", data);
  useEffect(() => {
    if (isLoading) {
      dispatch(setLoading(true));
    } else if (data) {
      dispatch(setCredentials(data.user));
    } else if (error) {
      dispatch(clearCredentials());
    }
  }, [data, error, isLoading, dispatch]);
};
