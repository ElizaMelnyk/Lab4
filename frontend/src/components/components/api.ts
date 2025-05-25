import axios from "axios";
import { ServerUser } from "./types";

export const fetchUserProfile = async () => {
    const response = await axios.get(
        "https://localhost:3000/auth/casdoor/profile",
        { withCredentials: true }
    );
    return response.data as ServerUser;
};

export const startBinanceStream = async () => {
    await axios.post(
        "https://localhost:3000/start-binance-stream",
        {},
        { withCredentials: true }
    );
};

export const stopBinanceStream = async () => {
    await axios.post(
        "https://localhost:3000/stop-binance-stream",
        {},
        { withCredentials: true }
    );
};