export interface FieldForm {
    field: string;
    type: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    options?: Array<{ value: string | number; label: string }>;
}

export interface ModalInterface<T extends Record<string, any>> {
    open: boolean;
    setOpen: (open: boolean) => void;
    inputForm?: FieldForm[];
    url: string;
    method: string;
    title: string;
    description: string;
    dataForm?: T;
}
