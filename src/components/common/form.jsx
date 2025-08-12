import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useId } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  formTitle,
  formDescription,
}) {
  const formId = useId();

  function renderInputsByComponentType(getControlItem) {
    const inputId = `${formId}-${getControlItem.name}`;
    const errorId = `${inputId}-error`;
    const value = formData[getControlItem.name] || "";
    const hasError = getControlItem.error;

    switch (getControlItem.componentType) {
      case "input":
        return (
          <Input
            id={inputId}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={getControlItem.required || false}
            autoComplete={getControlItem.autoComplete}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(selectedValue) =>
              setFormData({
                ...formData,
                [getControlItem.name]: selectedValue,
              })
            }
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={getControlItem.required || false}
          >
            <SelectTrigger
              id={inputId}
              className="w-full"
              aria-label={getControlItem.label}
            >
              <SelectValue
                placeholder={
                  getControlItem.placeholder || `Select ${getControlItem.label}`
                }
              />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

      case "textarea":
        return (
          <Textarea
            id={inputId}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={getControlItem.required || false}
            rows={getControlItem.rows || 4}
          />
        );

      default:
        return (
          <Input
            id={inputId}
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError ? "true" : "false"}
            aria-required={getControlItem.required || false}
          />
        );
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      role="form"
      aria-labelledby={formTitle ? `${formId}-title` : undefined}
    >
      {formTitle && (
        <h2 id={`${formId}-title`} className="text-xl font-semibold mb-4">
          {formTitle}
        </h2>
      )}
      {formDescription && (
        <p
          className="text-sm text-muted-foreground mb-4"
          id={`${formId}-description`}
        >
          {formDescription}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => {
          const inputId = `${formId}-${controlItem.name}`;
          const errorId = `${inputId}-error`;

          return (
            <div className="grid w-full gap-1.5" key={controlItem.name}>
              <Label
                htmlFor={inputId}
                className="mb-1"
                aria-required={controlItem.required || false}
              >
                {controlItem.label}
                {controlItem.required && (
                  <span className="text-destructive ml-1" aria-label="required">
                    *
                  </span>
                )}
              </Label>
              {renderInputsByComponentType(controlItem)}
              {controlItem.error && (
                <div
                  id={errorId}
                  className="text-sm text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  {controlItem.error}
                </div>
              )}
              {controlItem.helpText && (
                <div className="text-xs text-muted-foreground">
                  {controlItem.helpText}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        disabled={isBtnDisabled}
        type="submit"
        className="mt-6 w-full"
        aria-describedby={
          isBtnDisabled ? `${formId}-submit-disabled` : undefined
        }
      >
        {buttonText || "Submit"}
      </Button>

      {isBtnDisabled && (
        <div
          id={`${formId}-submit-disabled`}
          className="sr-only"
          aria-live="polite"
        >
          Form submission is currently disabled. Please fill in all required
          fields.
        </div>
      )}
    </form>
  );
}

export default CommonForm;
