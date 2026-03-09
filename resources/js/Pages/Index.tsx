import { Head, Link, useForm } from "@inertiajs/react";

interface Props {
    appName: string;
    message?: string;
}

export default function Index({ appName, message }: Props) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        name: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("welcome"));
    };

    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
                <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome to {appName}! 🚀
                    </h1>

                    {message && (
                        <p className="text-green-600 mb-4">{message}</p>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {processing ? "Sending..." : "Send"}
                        </button>

                        {recentlySuccessful && (
                            <p className="text-green-500 text-sm">
                                Sent successfully!
                            </p>
                        )}
                    </form>

                    <div className="mt-6 pt-6 border-t">
                        <Link
                            href={route("home")}
                            className="text-blue-600 hover:underline"
                        >
                            Go to Home →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
