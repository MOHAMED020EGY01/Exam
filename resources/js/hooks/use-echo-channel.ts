import { useEffect } from "react";

type EchoEventCallback<T = any> = (data: T) => void;

export function useEchoChannel<T = any>(
    channelName: string,
    eventName: string,
    callback: EchoEventCallback<T>,
    deps: any[] = [],
) {
    useEffect(() => {
        if (!window.Echo || !channelName || !eventName) return;

        const channel = window.Echo.channel(channelName);

        channel.listen(eventName, callback);

        return () => {
            channel.stopListening(eventName);
            window.Echo.leave(channelName);
        };
    }, [channelName, eventName, ...deps]);
}
