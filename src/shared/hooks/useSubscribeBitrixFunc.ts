export default function SubscribeBitrixFunc(
  targetObj: any,
  methodName: string,
  handler: Function
) {
  if (!targetObj || typeof targetObj[methodName] !== "function") {
    console.warn("SubscribeBitrixFunc: метод не найден", methodName);
    return;
  }

  // Guard на объекте
  if ((targetObj as any)[methodName].__patchedHays) return;
  (targetObj as any)[methodName].__patchedHays = true;

  const original = targetObj[methodName];

  targetObj[methodName] = function (...args: any[]) {
    const result = original.apply(this, args);

    try {
      const patched = handler.apply(this, [result, ...args]);
      return patched !== undefined ? patched : result;
    } catch (e) {
      console.error("Ошибка в SubscribeBitrixFunc handler:", e);
      return result;
    }
  };

  console.log(`SubscribeBitrixFunc: перехвачен метод ${methodName}`);
}
