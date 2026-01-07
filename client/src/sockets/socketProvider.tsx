import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "./socket";
import { RootState } from "@/src/store";
import { SOCKET_EVENTS } from "./socketEvents";
import { useNavigate } from "react-router-dom";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { token, user, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );
    const navigate = useNavigate();

    const routes = ['/', '/login', '/register'];
    if(token) {
        const exists = routes.some(p => p === window.location.pathname)
        if(exists) {
            navigate('/home');
        }
    }

    useEffect(() => {
        if (!isAuthenticated || !token || !user) return;

        if (!socket.connected) {
            socket.connect();

            socket.once("connect", () => {
                console.log("🟢 Socket connected:", socket.id);

                socket.emit(SOCKET_EVENTS.HELLO, {
                    id: user.id,
                    name: user.name,
                });

                socket.emit(SOCKET_EVENTS.PRESENCE_REQUEST);
            });
        }
    }, [isAuthenticated, token, user]);

    return <>{children}</>;
};
