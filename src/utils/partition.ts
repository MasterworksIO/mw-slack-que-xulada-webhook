interface IPartitionPredicate<T> {
  (arg: T): boolean
}

/**
 * Partition an array into two arrays based on a predicate function.
 *
 * @template T - The type of elements in the input array.
 * @template L - The type of elements in the left partition.
 * @template R - The type of elements in the right partition.
 * @param {T[]} list - The input array.
 * @param {IPartitionPredicate<T>} predicate - The function to determine which partition an element belongs to.
 * @returns {[L[], R[]]} - An array of two arrays, the left partition and the right partition.
 *
 * @example
 * const list = [1, 2, 3, 4, 5]
 * const [evens, odds] = partition(list, x => x % 2 === 0)
 * console.log(evens) //=> [2, 4]
 * console.log(odds) //=> [1, 3, 5]
 */
const partition = <T, L extends T = T, R extends T = T>(
  list: T[],
  predicate: IPartitionPredicate<T>
): [L[], R[]] => {
  const result: [L[], R[]] = [[], []]

  return list.reduce((acc, x) => {
    const [left, right] = acc

    if (predicate(x)) {
      left.push(x as L)
    } else {
      right.push(x as R)
    }

    return acc
  }, result)
}

export default partition
