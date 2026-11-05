import { isEmpty } from "./isEmpty";

interface ConvertToLocaleParams {
  amount: number;
  currency_code: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  locale?: string;
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) =>
  currency_code && !isEmpty(currency_code)
    ? new Intl.NumberFormat(locale, {
        currency: currency_code,
        maximumFractionDigits,
        minimumFractionDigits,
        style: "currency",
      }).format(amount)
    : amount.toString();
