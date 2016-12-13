/*
 1 шаг - обработать все картинки удалив фон
 2 шаг - все картинки привести к единому размеру
 3 шаг склеить все картинки
 */


var fs = require('fs');
var gm = require('gm');
var arr = [];
fs.readdir('/var/www/caric.com/public/images/data/tires', function(err, items) {
    console.log('in dir');
    console.log(err);
    for (var i = 0; i < items.length;i++) {
/*
var name = items[i].split('.');

		//убираем фон
        gm('/var/www/caric.com/public/images/data/tires/'+items[i])
        		  .quality(100)
        		  .fuzz('20%')
        		  .fill('white')
        		  .quality(100)
        		  .transparent('white')
        		  //.trim()
        		  //.resize('300','200')
        		  .write('/var/www/caric.com/public/images/data/t/'+name[0]+'.PNG', function (err) {
        		    if (!err) console.log('done'); else console.log(err);

        		  });*/



        //var newName = items[i].replace(' ','_');
        //fs.rename('/var/www/caric.com/public/images/data/wheels/'+items[i], '/var/www/caric.com/public/images/data/wheels/'+newName, function(err,end){console.log(err);console.log(end);});
        //fs.rename('/var/www/caric.com/public/images/data/auto/'+items[i], '/var/www/caric.com/public/images/data/auto/'+i+'_'+items[i], function(err,end){console.log(err);console.log(end);});

    }

    // var i = 1;
    // var g;
    // var length = arr.length*300;
    // (function step(i, gm, g,length){
    //    	  var name = arr[i].split('.')[0];
    //    	  gm('wheels/'+arr[i])
    // 		  .quality(100)
    // 		  .fuzz('20%')
    // 		  .fill('white')
    // 		  .quality(100)
    // 		  .transparent('white')
    // 		  //.trim()
    // 		  .resize('300','200')
    // 		  .write('wheels_end/'+name+'.png', function (err) {
    // 		    if (!err) console.log('done'); else console.log(err);

    // 		    if(i == 1) {
    // 		    	g = gm('wheels_end/'+name+'.png')
    // 		    } else {
    // 		    	g.append('wheels_end/'+name+'.png',true);
    // 		    }

    // 		    if(++i < arr.length) {
    // 		    	step(i++, gm, g, length);
    // 		    } else {
    // 			    g.write('wheels.png', function(err) {
    // 		      		if (!err) {
    // 		      			console.log('All done'); } else { console.log(err) };
    // 				});
    // 		    }
    // 		  });

    //    })(i,gm, g,length)





});