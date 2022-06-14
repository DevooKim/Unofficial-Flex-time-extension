import axios from "axios";
import { useEffect, useState } from "react";

const fetch = async (callback: (res: string) => void) => {
    const { data } = await axios.get(
        "https://flex.team/api/v2/core/users/me/user-settings"
    );
    const { userIdHash } = data.setting;

    callback(userIdHash);
};
const useFetchUserIdHash = (): string => {
    const [userIdHash, setUserIdHash] = useState<string>("");

    useEffect(() => {
        fetch(setUserIdHash);
    }, []);

    return userIdHash;
};

export default useFetchUserIdHash;
