import { Converter } from "opencc-js";

const converter = Converter({ from: "cn", to: "tw" });

export const convertToTC = (text) => {
  return converter(text);
};
