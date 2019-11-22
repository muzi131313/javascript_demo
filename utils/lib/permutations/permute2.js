(function() {
  let arr = [1,2,3];
  let res = []
  function arrange(arr, temp){
      for(let i = 0,length = arr.length; i<length; i++) {
          let _temp = temp.slice(0)
          console.log('_temp: ', _temp)
          // 最后一步
          if (_temp.length == length - 1) {
              if(!_temp.includes(arr[i])) {
                  _temp.push(arr[i])
                  res.push(_temp)
              }
              continue;
          }
          // 分而治
          if (!_temp.includes(arr[i])) {
              _temp.push(arr[i])
              arrange(arr, _temp);
          }
      }
  }
  arrange(arr,[]);
//     console.log(res)
})()
