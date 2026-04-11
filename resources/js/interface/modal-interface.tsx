export type httpMethod = 'post' | 'get' | 'put' | 'patch' | 'delete';
export interface FieldForm {
  field:string;
  type: 'input' | 'select' | 'checkbox' | 'textarea' | 'radio'
}
export interface ModalInterface<T> {
  open: boolean;
  setOpen: (open: boolean) => void;
  url: string;
  method: httpMethod;
  title: string;
  description: string;
  inputForm?: FieldForm[];
  dataForm?: T;
  children?: React.ReactNode;
}
