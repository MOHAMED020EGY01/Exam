import React from "react";

export type TypeMethodHTTP = "get" | "post" | "put" | "delete";
export type Variant = "default" | "destructive";

export interface DropdownItemInterface {
    label: string;
    icon: React.ReactNode;
    openModal: boolean;
    openModalFn?: Function;
    href?: string;
    method?: TypeMethodHTTP;
    variant?: Variant;
    danger?: boolean;
    download?: boolean;
}
