import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from '../store/store';

export const useAuthCheck = () => {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);

    const checkAuth = () => {
        if (!user) {
            router.replace('/login');
        }
    };

    useEffect(() => {
        checkAuth(); 
    }, [user]);

    return checkAuth;
};