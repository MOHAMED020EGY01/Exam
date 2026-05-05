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