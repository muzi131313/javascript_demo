var getArray = (arr) => {
  const result = [];

  const arrange = (tempArr) => {
    const tempArrLength = tempArr.length;
    const length = arr.length;
    for (var i = 0; i < length; i++) {
      const index = tempArr.findIndex(item => item === arr[i]);
      if (tempArrLength === length - 1 && index < 0) {
        result.push([...tempArr, arr[i]]);
        continue;
      }
      if (index < 0) {
        arrange([...tempArr, arr[i]]);
      }
    }
  }
  arrange([]);
  return result;
}

console.log(getArray([1, 2, 3]));
// [ [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1] ]
