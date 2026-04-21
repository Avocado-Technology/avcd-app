import en from "./messages/en.json";

type Messages = typeof en;

declare global {
  // Mirrors next-intl’s augmentation pattern; Messages is the full nested shape from en.json.
  type IntlMessages = Messages;
}
