//使用方法
//var demo = new redPackets({
//    max:0.2,
//    min:0,
//    allMoney:1,
//    len:10
//});
//console.log(demo);
(function (global,factory) {
    global.redPackets = factory()
})(this,function () {
    var Rd = function (obj) {
        /**
         * 配置文件
         * @type {{max: number, min: number, allMoney: number, len: number}}
         */
        this.config = {//默认配置
            max:0,
            min:0,
            allMoney:0,
            len:0
        };
        this.config.max = obj.max;
        this.config.min = obj.min || 0.01;
        this.config.allMoney = obj.allMoney;
        this.config.len = obj.len;
        return this.run();
    };

    //缓存记录区域
    Rd.prototype.cacheRecord = {};
    /**
     * 随机数 得到数字类型
     * 保留两位小数
     * 功能：将浮点数四舍五入，取小数点后2位
     * @param {Number} x
     * @returns {Number}
     */
    Rd.prototype.toDecimal = function(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return;
        }
        f = Math.round(x*100)/100;
        return f;
    };

    /**
     * 随机数 得到数字类型
     * 强制制保留2位小数，如：2，会在2后面补上00.即2.00
     * @param {Number} x
     * @returns {String}
     */
    Rd.prototype.toDecimal2 = function(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    };
    /**
     * 获取随机数
     * @returns {Number}
     */
    Rd.prototype.getRandom = function () {
        if (this.config.min <= 0){//最小值默认不得小于或者等于0
            var customRandom = Math.random();//定制随机数
            console.log(customRandom)
        }else {
            var customRandom = Math.random()*(this.config.max-this.config.min);//定制随机数
        }

        var customRandom2 = this.toDecimal(customRandom);//定制保留2位小数随机数
        return customRandom2;
    };
    /**
     * 分配最小值
     */
    Rd.prototype.assignsMin = function () {
        if(this.config.len <= 0){
            var info = "人数不能小于0";
            return {
                success:false,
                massage:info
            }
        }
        if(this.config.len > 100){
            var info = "人数不能大于100";
            return {
                success:false,
                massage:info
            }
        }
        if(this.config.min < 0){
            var info = "最小值不能小于0";
            return {
                success:false,
                massage:info
            }
        }
        if(this.config.allMoney <= 0){
            var info = "总额必须大于0";
            return {
                success:false,
                massage:info
            }
        }
        if(this.config.allMoney < this.config.len*this.config.min){
            var info = "总额不能小于 总人数*最小分配值";
            return {
                success:false,
                massage:info
            }
        }
        if(this.config.max < this.config.min){
            var info = "最大值不能小于最小值";
            return {
                success:false,
                massage:info
            }
        }
        //总额过大 人数过少 最大值太小
        if(this.config.allMoney/this.config.len > this.config.max){
            var info = "总额("+this.config.allMoney+")过大或人数("+this.config.len+")过少或最大值("+this.config.max+")太小\n按照最大值计算："+this.config.max+"(最大值)X"+this.config.len+"(人数)="+this.config.max*this.config.len+"(总额)\n兄弟：Are you kidding me???";
            return {
                success:false,
                massage:info
            };
        }
        this.cacheRecord.arr = [];
        for(var i = 0 ; i < this.config.len ; i++){//分配最小值
            this.cacheRecord.arr[i] = this.config.min
        }
        this.cacheRecord.allSurplus = this.config.allMoney - this.config.len * this.config.min;//记录剩余量
        return {
            success:true,
            massage:info
        };
    };
    /**
     * 加入随机值
     */
    Rd.prototype.addRandom = function () {
        for(var m = 0 ; m < this.cacheRecord.arr.length ; m++){
            var getRD = this.getRandom();//获取随机数值
            //得到的随机数+基数大于最大值 且 随机数大于剩余量
            //重新获取
            if(this.toDecimal(this.cacheRecord.arr[m]+getRD) > this.config.max || this.toDecimal(this.toDecimal(this.cacheRecord.allSurplus) - getRD) < 0){
                m--;
                continue;
            }else {
                //添加随机值到具体数组
                this.cacheRecord.arr[m] = this.toDecimal(this.toDecimal(this.cacheRecord.arr[m])+getRD);
                //从总数里减去累加的值
                this.cacheRecord.allSurplus = this.toDecimal(this.cacheRecord.allSurplus - getRD);
            }
        }
        //计算接近尾声
        if(this.toDecimal(this.cacheRecord.allSurplus) > 0){
            for(var i = 0 ;;i++){
                //分配完毕
                if(this.toDecimal(this.cacheRecord.allSurplus) == 0){
                    break;
                }
                //小于或者等于数组长度
                if(i <= this.config.len-1){
                    if(this.cacheRecord.arr[i] == 12){
                        continue;
                    }
                    this.cacheRecord.arr[i] = this.toDecimal(this.toDecimal(this.cacheRecord.arr[i])+0.01);
                    this.cacheRecord.allSurplus = this.toDecimal(this.toDecimal(this.cacheRecord.allSurplus) - 0.01);
                }else {
                    i = 0
                }
            }
        }
    };
    Rd.prototype.run = function () {
        var rel = this.assignsMin();
        if(!rel.success){
            alert(rel.massage);
            return []
        }
        this.addRandom();
        return this.cacheRecord.arr;
    };
    return Rd;
});