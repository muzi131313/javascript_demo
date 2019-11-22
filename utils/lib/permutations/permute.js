// https://stackoverflow.com/questions/9960908/permutations-in-javascript

function getArray(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    /**
     * 关于循环中取出其中的值
      var arr = [1, 2, 3]
      var arr2 = [1, 2, 3, 4]
      function forEachArr(arr) {
        for (var i = 0;i < arr.length;i++) {
          var b = arr.splice(i, 1)
          console.log(b, ',', arr)
        }
      }
      forEachArr(arr)
      // [1], [2, 3]
      // [3], [2]
      forEachArr(arr2)
      // [1], [2, 3, 4]
      // [3], [2, 4]
     */
    for (var i = 0; i < arr.length; i++) {
      /**
       * 举个例子：
       * var a = [1, 2, 3]; var b = a.splice(0, 1);
       * console.log(b) // => [1]
       * console.log(a) // => [2, 3]
       * arr.splice(i, 1) // => 取出第i个数据，并删除原数组中的这个值
       */
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}
var nums = [1,2,3]
var allSorts = getArray(nums)
console.table(allSorts) // => [ [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1] ]
