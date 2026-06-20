/**
 * global.tsx
 *
 * Purpose:
 * Shared interfaces and generic type declarations used across UI/UX components.
 *
 * Responsibilities:
 * - Define DropdownItemInterface configurations
 * - Define CardInterface props
 * - Define generic openSetOpenInterface toggles
 *
 * Dependencies:
 * - React
 */

import { ReactNode } from "react"

type Method = "get" | "post" | "put" | "delete"
type Variant = "default" | "destructive"


export interface DropdownItemInterface {
    label: string
    icon: ReactNode
    openModal:boolean
    openModalFn?:Function;
    href?: string
    method?: Method
    variant?: Variant
    danger?: boolean
    download?: boolean
}



export interface CardInterface {
    title: string;
    count: number;
    description: string;
    children:React.ReactNode
}

export interface openSetOpenInterface{
    open: boolean;
    setOpen: (open: boolean) => void;
}