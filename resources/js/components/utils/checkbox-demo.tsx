import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup } from "@/components/ui/field"

export function CheckboxInvalid({...props}: React.ComponentProps<typeof Checkbox>) {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          aria-invalid
          {...props}
        />
      </Field>
    </FieldGroup>
  )
}
