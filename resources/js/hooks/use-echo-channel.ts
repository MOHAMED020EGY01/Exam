import { useEffect } from "react";

type EchoEventCallback<T = unknown> = (data: T) => void;

export function useEchoChannel<T = unknown>(
    channelName: string,
    eventName: string,
    callback: EchoEventCallback<T>,
    deps: unknown[] = [],
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
