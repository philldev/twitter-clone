import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserInitials(username: string) {
  const split = username.split(" ");

  if (split.length > 1) {
    const [first, second] = split;
    return `${first[0]} ${second[0]}`;
  }

  const [first] = split;

  return first[0];
}

const numberFormatter = Intl.NumberFormat("en", { notation: "compact" });

export function formatNumber(number: number) {
  return numberFormatter.format(number);
}
