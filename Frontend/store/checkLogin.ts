import { useRouter } from "expo-router";
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

    return checkAuth;
};