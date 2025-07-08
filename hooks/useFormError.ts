import { useMemo } from "react";

type FieldErrors = Record<string, string[] | undefined>;
type GeneralError = { general: string[] };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type FormError = FieldErrors | GeneralError;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionState = any;

interface UseFormErrorReturn {
  getFieldError: (fieldName: string) => string | undefined;
  getGeneralError: () => string | undefined;
  hasError: boolean;
  hasGeneralError: boolean;
  hasFieldError: (fieldName: string) => boolean;
  isSuccess: boolean;
}

export const useFormError = (state: ActionState): UseFormErrorReturn => {
  const errorHelpers = useMemo(() => {
    const getFieldError = (fieldName: string): string | undefined => {
      if (!state) return undefined;

      const errorObj = state?.error;
      if (!errorObj) return undefined;

      if ("general" in errorObj) return undefined;

      const fieldErrors = errorObj as FieldErrors;
      const fieldError = fieldErrors[fieldName];

      return fieldError && fieldError.length > 0 ? fieldError[0] : undefined;
    };

    const getGeneralError = (): string | undefined => {
      if (!state) return undefined;

      const errorObj = state?.error;
      if (!errorObj || !("general" in errorObj)) return undefined;

      const generalErrors = errorObj.general as string[];
      return generalErrors && generalErrors.length > 0
        ? generalErrors[0]
        : undefined;
    };

    const hasError = Boolean(state?.error);
    const hasGeneralError = Boolean(getGeneralError());
    const isSuccess = Boolean(state?.success === true);

    const hasFieldError = (fieldName: string): boolean => {
      return Boolean(getFieldError(fieldName));
    };

    return {
      getFieldError,
      getGeneralError,
      hasError,
      hasGeneralError,
      hasFieldError,
      isSuccess,
    };
  }, [state]);

  return errorHelpers;
};
