/**
 * ARIA-related constants
 */

import type { AriaRole } from "@workspace/types/aria";

/**
 * Common ARIA roles
 */
export const ARIA_ROLES: Record<string, AriaRole> = {
  button: {
    name: "button",
    description: "An interactive element that triggers an action.",
    supportedAttributes: [
      "aria-label",
      "aria-pressed",
      "aria-expanded",
      "aria-disabled",
    ],
  },
  link: {
    name: "link",
    description: "A navigational link.",
    supportedAttributes: ["aria-label", "aria-current"],
  },
  navigation: {
    name: "navigation",
    description: "A collection of navigational elements.",
    supportedAttributes: ["aria-label"],
  },
  banner: {
    name: "banner",
    description: "A site header or banner.",
    supportedAttributes: ["aria-label"],
  },
  main: {
    name: "main",
    description: "The main content of the document.",
    supportedAttributes: ["aria-label"],
  },
  complementary: {
    name: "complementary",
    description: "Supporting content that complements the main content.",
    supportedAttributes: ["aria-label"],
  },
  contentinfo: {
    name: "contentinfo",
    description: "Information about the parent document.",
    supportedAttributes: ["aria-label"],
  },
  article: {
    name: "article",
    description: "A standalone composition.",
    supportedAttributes: ["aria-label"],
  },
  region: {
    name: "region",
    description: "A perceivable section of content.",
    supportedAttributes: ["aria-label"],
  },
  search: {
    name: "search",
    description: "A search tool.",
    supportedAttributes: ["aria-label"],
  },
  form: {
    name: "form",
    description: "A form container.",
    supportedAttributes: ["aria-label"],
  },
  dialog: {
    name: "dialog",
    description: "A dialog or modal window.",
    supportedAttributes: ["aria-label", "aria-labelledby", "aria-describedby"],
  },
  alert: {
    name: "alert",
    description: "Important and time-sensitive information.",
    supportedAttributes: ["aria-label", "aria-live"],
  },
  alertdialog: {
    name: "alertdialog",
    description: "A modal alert dialog.",
    supportedAttributes: ["aria-label", "aria-labelledby", "aria-describedby"],
  },
  status: {
    name: "status",
    description: "A status message or advisory.",
    supportedAttributes: ["aria-label", "aria-live"],
  },
  tablist: {
    name: "tablist",
    description: "A list of tabs.",
    supportedAttributes: ["aria-label", "aria-orientation"],
  },
  tab: {
    name: "tab",
    description: "A tab in a tablist.",
    supportedAttributes: ["aria-label", "aria-selected", "aria-controls"],
  },
  tabpanel: {
    name: "tabpanel",
    description: "A panel associated with a tab.",
    supportedAttributes: ["aria-label", "aria-labelledby"],
  },
  menu: {
    name: "menu",
    description: "A menu of options.",
    supportedAttributes: ["aria-label"],
  },
  menuitem: {
    name: "menuitem",
    description: "An option in a menu.",
    supportedAttributes: ["aria-label", "aria-checked", "aria-disabled"],
  },
  listbox: {
    name: "listbox",
    description: "A list of selectable options.",
    supportedAttributes: ["aria-label", "aria-multiselectable"],
  },
  option: {
    name: "option",
    description: "An option in a listbox.",
    supportedAttributes: ["aria-label", "aria-selected"],
  },
  checkbox: {
    name: "checkbox",
    description: "A checkable input.",
    supportedAttributes: ["aria-label", "aria-checked", "aria-required"],
  },
  radio: {
    name: "radio",
    description: "A radio button in a group.",
    supportedAttributes: ["aria-label", "aria-checked", "aria-required"],
  },
  textbox: {
    name: "textbox",
    description: "A text input field.",
    supportedAttributes: [
      "aria-label",
      "aria-labelledby",
      "aria-required",
      "aria-invalid",
      "aria-readonly",
    ],
  },
  progressbar: {
    name: "progressbar",
    description: "A progress indicator.",
    supportedAttributes: [
      "aria-label",
      "aria-valuenow",
      "aria-valuemin",
      "aria-valuemax",
    ],
  },
  slider: {
    name: "slider",
    description: "A slider control.",
    supportedAttributes: [
      "aria-label",
      "aria-valuenow",
      "aria-valuemin",
      "aria-valuemax",
    ],
  },
};

