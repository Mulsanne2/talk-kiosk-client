import axios from "axios";

const header = {
  "Content-Type": `application/json`,
};

// 여기부터 js서버 api
export interface IOrdered {
  order: number;
  price: number;
  takeout: boolean;
  menu: {
    id: number[];
    set: number[];
    option: number[];
    qty: number;
  }[];
  orderedIdx?: number;
}

interface IGetOrder {
  code: number;
  isSuccess: boolean;
  message: string;
  result: {
    jsonInfo: {
      ordered: IOrdered;
      orderedIdx: number;
    }[];
  };
}

export function postOrdered(data: IOrdered) {
  try {
    // Client-side Validation
    if (
      // 데이터 형식에 필요한 모든 키 값이 존재하는지 검사
      data?.order === undefined ||
      data?.price === undefined ||
      data?.takeout === undefined ||
      data?.menu === undefined
    ) {
      throw new Error(`"order", "price", "takeout", "meun" keys are required.`);
    } else {
      // 메뉴 배열에 하나 이상의 데이터가 있는지 검사
      if (data.menu.length <= 0) {
        throw new Error(`menu[] must contain at least one menu.`);
      } else {
        data.menu.map((item) => {
          // 메뉴 배열의 아이템 형식이 객체인지 검사
          if (typeof item !== "object") {
            throw new Error(`menu[] must have only object types.`);
          } else {
            // 메뉴 배열의 아이템 객체의 id키의 존재여부와 값이 number 타입인지 검사
            if (item?.id === undefined || typeof item.id !== "number") {
              throw new Error(`menu must have "id" key and number value.`);
            }
          }
          return null;
        });
      }
      // order키의 값이 number 타입인지 검사
      if (typeof data.order !== "number") {
        throw new Error(`typeof "order" key is must be number value.`);
      }
      // price키의 값이 number 타입인지 검사
      if (typeof data.price !== "number") {
        throw new Error(`typeof "price" key is must be number value.`);
      }
      // takeout키의 값이 boolean 타입인지 검사
      if (typeof data.takeout !== "boolean") {
        throw new Error(`typeof "takeout" key is must be boolean value.`);
      }
    }

    const json = {
      data: data,
    };
    axios
      .post("https://talking-kiosk.shop/app/ordered", JSON.stringify(json), {
        headers: header,
      })
      .then((res) => console.log(res));
  } catch (err) {
    console.log(err);
  }
}

export async function GetOrdered(status?: string): Promise<IOrdered[]> {
  let result: IOrdered[] = [];
  try {
    const res = await axios.get<IGetOrder>(
      `https://talking-kiosk.shop/app/ordered?status=${status}`
    );
    const resResult = res.data.result.jsonInfo;
    resResult.map((order, idx) => {
      result.push(order.ordered);
      result[idx].orderedIdx = order.orderedIdx;
      return null;
    });
  } catch (err) {
    console.log(err);
  } finally {
    return result;
  }
}

export async function setOrderStatus(idx: number | undefined, status: string) {
  try {
    if (idx === undefined)
      throw new Error("setOrderStatus function required idx parameter.");
    console.log(idx, status);
    await axios.patch(
      `https://talking-kiosk.shop/app/ordered/${idx}?status=${status}`
    );
  } catch (err) {
    console.log(err);
  }
}

//여기부터 flask서버 api
export interface IPostOrderList {
  order_list: {
    menu: number[];
    option: number[];
    set: number[];
    qty: number;
  }[];
  code: number;
}

export interface IPostConflictSolve {
  resolve: number;
  code: number;
}

export interface IPostOption {
  option: number[];
  code: number;
}

export interface IPostSet {
  set: number[];
  code: number;
}

export async function postOrderList(text: string): Promise<IPostOrderList> {
  let result: IPostOrderList = { order_list: [], code: 0 };
  try {
    const postJson: any = { text: text };

    const data = await axios.post<IPostOrderList>(
      "http://127.0.0.1:8000/order",
      JSON.stringify(postJson),
      {
        headers: header,
      }
    );
    result.order_list = data.data.order_list;
    result.code = data.data.code;
  } catch (err) {
    console.log(err);
  } finally {
    return result;
  }
}

export async function postConflictSolve(
  text: string,
  menuId: number[]
): Promise<IPostConflictSolve> {
  let result: IPostConflictSolve = { resolve: 0, code: 0 };
  try {
    const postJson: any = { text: text, menu_id: menuId };

    const data = await axios.post<IPostConflictSolve>(
      "http://127.0.0.1:8000/order/conflict",
      JSON.stringify(postJson),
      {
        headers: header,
      }
    );
    result.resolve = data.data.resolve;
    result.code = data.data.code;
  } catch (err) {
    console.log(err);
  } finally {
    return result;
  }
}

export async function postOption(text: string): Promise<IPostOption> {
  let result: IPostOption = { option: [], code: 0 };
  try {
    const postJson: any = { text: text };

    const data = await axios.post<IPostOption>(
      "http://127.0.0.1:8000/option",
      JSON.stringify(postJson),
      {
        headers: header,
      }
    );
    result.option = data.data.option;
    result.code = data.data.code;
  } catch (err) {
    console.log(err);
  } finally {
    return result;
  }
}

export async function postSet(text: string, set: number[]): Promise<IPostSet> {
  let result: IPostSet = { set: [], code: 0 };
  try {
    let postJson: any = { text: text, set: set };

    const data = await axios.post<IPostSet>(
      "http://127.0.0.1:8000/set",
      JSON.stringify(postJson),
      {
        headers: header,
      }
    );
    result.set = data.data.set;
    result.code = data.data.code;
  } catch (err) {
    console.log(err);
  } finally {
    return result;
  }
}
