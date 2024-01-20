export function removeElementFromArray<T>(
  array: T[],
  element: T,
  key?: string
): T[] {
  const elementIndex = getElementIndex(array, element, key);
  return removeElementFromArrayByIndex(array, elementIndex);
  // return elementIndex !== -1
  //   ? [...array.slice(0, elementIndex), ...array.slice(elementIndex + 1)]
  //   : array;
}

export function removeElementFromArrayByIndex<T>(
  array: T[],
  index: number
): T[] {
  return index !== -1
    ? [...array.slice(0, index), ...array.slice(index + 1)]
    : array;
}

export function upsertElementInArray<T>(
  array: T[],
  element: T,
  key?: string
): T[] {
  const elementIndex = getElementIndex(array, element, key);
  return elementIndex !== -1
    ? [
        ...array.slice(0, elementIndex),
        element,
        ...array.slice(elementIndex + 1),
      ]
    : [...array, element];
}

export function getElementIndex<T>(
  array: T[],
  element: T,
  key?: string
): number {
  if (key === undefined)
    return array.findIndex(
      (item) => JSON.stringify(item) === JSON.stringify(element)
    );
  return array.findIndex((item: any) => {
    if (item[key] === undefined) return false;
    return item[key] === (element as any)[key];
  });
}

export function insertElementArrayAtIndex<T>(
  array: T[],
  elem: T,
  index: number
): T[] {
  if (index < 0 || index > array.length - 1) throw Error('Invalid index');
  return [...array.slice(0, index), elem, ...array.slice(index + 1)];
}

export function addElementArrayAtIndex<T>(
  array: T[],
  elem: T,
  index: number
): T[] {
  if (index < 0 || index > array.length) throw Error('Invalid index');
  const newArray = [...array];
  newArray.splice(index, 0, elem);
  return newArray;
}

export function flatArray<T>(array: T[][]): T[] {
  return Array.prototype.concat.apply([], array);
}

export function removeDuplicate<T>(array: T[], key: string | number): T[] {
  return array.filter((item: any, index: number, self: T[]) => {
    if (!item.hasOwnProperty(key)) return item;
    return self.findIndex((i: any) => i[key] === item[key]) === index;
  });
}

export function moveElement<T>(array: T[], from: number, to: number): T[] {
  if (from > array.length) throw Error('Invalid "from" index');
  if (to > array.length || to < 0) throw Error('Invalid "to" index');
  const fromElement = array[from];
  const addIndex = from < to ? to + 1 : to;
  const removeIndex = from < to ? from : from + 1;
  const newArray = addElementArrayAtIndex<T>(array, fromElement, addIndex);
  return removeElementFromArrayByIndex<T>(newArray, removeIndex);
}
