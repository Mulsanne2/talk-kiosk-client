import { atom } from "recoil";
import { IOrdered } from "./api";

export const screenUpdate = atom<boolean>({
  key: "screenUpdate",
  default: false,
});

export const stText = atom<string>({
  key: "stText",
  default: "",
});

export const orderedMenu = atom<IOrdered>({
  key: "orderedMenu",
  default: {
    order: Math.floor(Math.random() * 10000),
    price: 0,
    takeout: false,
    menu: [],
  },
});

export const resultCode = atom<number | undefined>({
  key: "resultCode",
  default: 0,
});

export const processing = atom<boolean>({
  key: "processing",
  default: false,
});

export const procIdx = atom<number>({
  key: "procIdx",
  default: 0,
});

export const menuSet = atom<number[]>({
  key: "set",
  default: [201, 301],
});

export const menuOption = atom<boolean[]>({
  key: "option",
  default: [false, false, false, false],
});
