import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@inertiajs/react"
import { Error } from "./ui/error"
import { cn } from "@/lib/utils"
import { Spinner } from "./ui/spinner"
import React from "react";
import { ModalInterface } from "@/interface/modal-interface"

const ModalDynamic= <T extends Record<string, any>>({ open, setOpen, inputForm, url, method, title, description, dataForm }: ModalInterface<T>) => {
  const inputFormSlice = inputForm?.reduce((acc, key) => {
    acc[key.field] = dataForm?.[key.field] ?? "";
    return acc;
  }, {} as Record<string, any>);

  const {data, setData, processing, submit, errors, resetAndClearErrors,reset} = useForm({
    ...inputFormSlice
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(method, url, {
      onSuccess: () => {
        reset()
        setOpen(false);
      },
    });
  };
  const close = () => {
    resetAndClearErrors()
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false}>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            {inputForm?.map((item, index) => {
              return (
                <Field key={index}>
                  <Label htmlFor={item.field}>{item.field}</Label>
                  <Input
                    className={cn(
                      errors[item.field] && "border-red-400"
                    )}
                    id={item.field}
                    name={item.field}
                    value={data[item.field]}
                    onChange={(e) => {
                      setData(item.field, e.target.value)
                    }} />
                  <Error message={errors[item.field]} />
                </Field>
              )
            })}
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={close}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={processing}>
              {processing ?
                <>
                  <Spinner />
                  Saving...
                </>
                : 'Save changes'}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}

export { ModalDynamic };