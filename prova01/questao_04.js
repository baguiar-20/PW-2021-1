const fs = require("fs");






fs.readFile('./1.txt', function(error1, data1) {
    fs.readFile('./2.txt', function(error2, data2) {
        fs.readFile('./3.txt', function(error3, data3) {
            if (!(error1 || error2 || error3)) {
            const val1 = parseInt(data1);
            const val2 = parseInt(data2);
            const val3 = parseInt(data3);
            const soma = val1 + val2 + val3;
            console.log(soma);
            }
        });
    });
});