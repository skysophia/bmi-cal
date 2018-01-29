        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyBVE7Az8PDf7zIuKDiVMJl1NpB_cuqvn4g",
            authDomain: "bmi-online.firebaseapp.com",
            databaseURL: "https://bmi-online.firebaseio.com",
            projectId: "bmi-online",
            storageBucket: "bmi-online.appspot.com",
            messagingSenderId: "351357095700"
        };
        firebase.initializeApp(config);

        // firebase.database().ref().set('myBmi');
        var bmiHistory = firebase.database().ref('myBmi');
        var vueBMI = new Vue({
            el: '#BMI-page',
            data: {
                inputHeight: '',
                inputWeight: '',
                bmiNo: '',
                bmiResult: '', //0:none 1 理想，2 過輕，3過重，4 輕度肥胖，5中度肥胖，6 重度肥胖
                bmi_list: {}
            },
            created: function() {
                var vm = this;
                var newData = [];
                bmiHistory.orderByChild('timestamp').on('value', function(snapshop) {
                    newData = []; // 清空資料
                    snapshop.forEach(function(item) {
                        newData.push(item.val());
                    })
                    //console.log(newData)
                    for (var i in newData) {
                        var t = newData[i].timestamp;
                        newData[i].date = vm.timeToDate(t);
                    }
                    newData.reverse();
                    vm.bmi_list = newData;
                });

            },
            methods: {
                timeToDate: function(time) {
                    var tt = new Date(time);
                    var ty = tt.getFullYear();
                    var tm = (tt.getMonth() + 1) > 9 ? (tt.getMonth() + 1) : '0' + (tt.getMonth() + 1);
                    var td = tt.getDate();
                    return ty + ' 年 ' + tm + ' 月 ' + td + ' 日 ';
                },
                getResult: function(h, w) {
                    h = parseFloat(h);
                    W = parseFloat(w);
                    if (isNaN(h)) { h = ''; return swal("Error", "身高只能是數字！", "error"); }
                    if (isNaN(w)) { w = ''; return swal("Error", "體重只能是數字！", "error"); }
                    if (!h && !w) { return swal("Error", "請輸入身高體重！", "error"); }
                    if (h && !w) { return swal("Error", "請輸入身高！", "error"); }
                    if (!h && w) { return swal("Error", "請輸入體重！", "error"); }
                    if( h == 0 || w == 0) { h=''; w=''; return swal("Error", "不可為 0 ", "error") }
                    this.calBMI();
                },
                calBMI: function() {
                    var vm = this;
                    var h = vm.inputHeight / 100;
                    var w = vm.inputWeight;
                    var word = '';
                    var level = '';
                    var d = new Date();
                    var timestamp = d.getTime();

                    if (isNaN(vm.inputHeight) || vm.inputWeight == "") h = 0;
                    if (isNaN(vm.inputWeight) || vm.inputWeight == "") w = 0;
                    h = parseFloat(h);
                    W = parseFloat(w);
                    var bmi = w / (h * h);
                    if (isNaN(bmi)) {
                        bmi = 0;
                    }

                    if (bmi != 0) {
                        bmi = bmi.toFixed(2);
                    }

                    if (bmi < 18.5) {
                        vm.bmiResult = 2;
                    } else if (bmi >= 18.5 && bmi < 24) {
                        vm.bmiResult = 1;
                    } else if (bmi >= 24 && bmi < 27) {
                        vm.bmiResult = 3;
                    } else if (bmi >= 27 && bmi < 30) {
                        vm.bmiResult = 4;
                    } else if (bmi >= 30 && bmi < 35) {
                        vm.bmiResult = 5;
                    } else if (bmi >= 35) {
                        vm.bmiResult = 6;
                    } else {
                        vm.bmiResult = 0;
                    }

                    // 將資料匯入資料庫
                    switch (vm.bmiResult) {
                        case 1:
                            word = '理想';
                            level = 1;
                            break;
                        case 2:
                            word = '過輕';
                            level = 2;
                            break;
                        case 3:
                            word = '過重';
                            level = 3;
                            break;
                        case 4:
                            word = '輕度肥胖';
                            level = 4;
                            break;
                        case 5:
                            word = '中度肥胖';
                            level = 5;
                            break;
                        case 6:
                            word = '重度肥胖';
                            level = 6;
                            break;
                        default:
                            word = '理想';
                            level = 1;
                            break;
                    }
                    if (bmi != 0) {
                        bmiHistory.push({
                            height: h * 100,
                            weight: w,
                            bmi: bmi,
                            word: word,
                            bmilevel: level,
                            timestamp: timestamp
                        });
                    }

                    vm.bmiNo = bmi;

                },
                renew: function() {
                    this.inputHeight = '';
                    this.inputWeight = '';
                    this.bmiNo = '';
                }

            },


        })