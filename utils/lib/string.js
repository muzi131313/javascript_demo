var StringUtils = {
    /**
     * [strCharLength 判断字符所占长度(倒序判断长度)]
     * @Author   liyanfeng
     * @DateTime 2017-10-18T19:45:06+0800
     * @param    {String}                 str [description]
     * @return   {[type]}                     [description]
     */
    strCharLength(str = '') {
        let len = str.length;
        let charLength = 0;
        while (len--) {
            charLength += this.charLength(str.charAt(len));
        }
        return charLength;
    },
    charLength(char = '') {
        return char.charCodeAt(0) > 255 ? 2 : 1;
    },
    /**
     * [charSub 剪切字符串,根据设定长度, ps: 正序判断长度]
     * @Author   liyanfeng
     * @DateTime 2017-10-18T19:52:41+0800
     * @param    {[type]}                 str [字符串]
     * @param    {Number}                 pos [剪切的字符长度]
     * @return   {[type]}                     [处理后的字符串]
     */
    charSub(str = '', pos = 0) {
        let len = str.length;
        let charLength = 0;
        let subChars = [];
        let i = 0;
        do {
            let char = str.charAt(i);
            charLength += this.charLength(char);
            if (charLength <= pos) {
                subChars.push(char);
            };
        } while (++i < len);
        if (charLength > pos) {
            subChars.push('...');
        }

        return subChars.join('');
    }
}
