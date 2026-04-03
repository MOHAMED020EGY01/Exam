/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string;
    // أضف متغيرات البيئة اللي تحتاجها هنا
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
    readonly glob: <T>(
        pattern: string,
        options?: { eager?: boolean; import?: string; query?: string | Record<string, string> }
    ) => Record<string, () => Promise<T>>;
}
