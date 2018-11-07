var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Diacritics = require('diacritic');
var fs = require('fs');
var array = fs.readFileSync('file.in').toString().split("\n");
var request = require('request');
var cheerio = require('cheerio');
//import model
var Food = require('./models/food');
var User = require('./models/user');
var UserInfo = require('./models/userInfo');
var PhoneCategory = require('./models/PhoneCategory')
var PhoneProduct = require('./models/PhoneProduct')
var DetailPhone = require('./models/DetailPhone')

var app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hoanglong96:hoanglong96@ds111618.mlab.com:11618/hoanglongdb', {
  useMongoClient: true
});

//Set port 
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
  //intervalObj
});

// const intervalObj = setInterval(() => {
//   checkCount();
// }, 1000);

var checkCount = function () {
  console.log("hihi")
}

//crawl category
// var urlCategory = "https://www.thegioididong.com/dtdd";
// request(urlCategory,function(err,res,body){
//   if(!err && res.statusCode == 200){
//     $ = cheerio.load(body)
//     var ds = $(body).find('.manuwrap .manunew a img');
//         ds.each(function(i,e){
//           var phoneCategory = new PhoneCategory({
//             image: 'https:'+$(this).attr('src'),
//             href: $(this).find('href')
//           });

//           phoneCategory.save(function (err, createdPhoneCategory) {
//             if (err) {
//               //res.json({ "success": 0, "message": "Could not add record: " + err });
//             } else {
//               console.log(createdPhoneCategory)
//               //res.json(createdPhoneCategory);
//             }
//           });
//     })
//   }
// })

//crawl detail item
// var urlItemDetail = "https://www.thegioididong.com/dtdd/samsung-galaxy-note-9";
// request(urlItemDetail,function(err,res,body){
//   if(!err && res.statusCode == 200){
//     var title;
//     var ratting;
//     var numberRatting;
//     var image;
//     var price;
//     var khuyenmai;
//     var listKhuyenMai = [String]
//     var $ = cheerio.load(body)
//     var ds = $(body).find('.rowtop')
//     ds.each(function(i,e){
//       title = $(this).find('h1').text()
//       ratting = $(this).find('.ratingresult .star').length
//       numberRatting = $(this).find('.ratingresult a').text()
//     })

//     var ds1 = $(body).find('.rowdetail')
//     ds1.each(function(i,e){
//       image = $(this).find('.picture img').attr('src')
//       price = $(this).find('.price_sale .area_price').text()
//       khuyenmai = $(this).find('.price_sale .area_promotion .infopr span').each(function(i,e){
//         var km = $(this).text()
//         listKhuyenMai.push(km)
//       })
//     })

//     var ds2 = $(body).find('.gamecombo ul')
//     ds2.each(function(i,e){
//         var item = $(this).text()
//         //console.log(item)
//     })

//     var ds3 = $(body).find('.box_content .left_content').each(function(i,e){
//       var characteristics = $(this).find('.characteristics h2').text()
//       var item1 = $(this).find('.characteristics #owl-detail .item img').each(function(i,e){
//         var ee = $(this).attr('data-src')
//         console.log(ee)
//       })
//     })
//   }
// })

app.post('/itemCrawl', function (req, res) {
  var body = req.body;
  var linkUrl = body.linkURL;

  request(linkUrl, function (error, res, body) {
    if (!error && res.statusCode == 200) {

      var title;
      var rating;
      var numberRating;
      var price;
      var sale;
      var listKhuyenMai = []
      var slider = []
      var listExtra = []
      var listThongSo = []
      var characteristics
      var h2
      var video
      var p
      var detailContent = []

      var $ = cheerio.load(body)
      var ds = $(body).find('.rowtop')

      //Crawl title, rating, numberRating
      ds.each(function (i, e) {
        title = $(this).find('h1').text()
        ratting = $(this).find('.ratingresult .star').length
        numberRatting = $(this).find('.ratingresult a').text()
      })

      //Crawl price, sale, 
      var ds1 = $(body).find('.rowdetail')
      ds1.each(function (i, e) {
        image = $(this).find('.picture img').attr('src')
        price = $(this).find('.price_sale .area_price strong').text()
        sale = $(this).find('.price_sale .area_price .installment').text()
        khuyenmai = $(this).find('.price_sale .area_promotion .infopr span').each(function (i, e) {
          var km = $(this).text()
          listKhuyenMai.push(km)
        })
      })

      //Sản phẩm đi kèm
      var ds2 = $(body).find('.gamecombo ul li')
      ds2.each(function (i, e) {
        var item = $(this).find('.info h3').text()
        var imageItem = $(this).find('img').attr('data-original')
        var obj = new Object();
        obj.imageExtra = imageItem;
        obj.titleExtra = item;
        listExtra.push(obj)
      })

      //Crawl thông số
      var thongso = $(body).find('.box_content .right_content .tableparameter li')
      thongso.each(function (i, e) {
        var titleThongSo = $(this).find('span').text()
        var titleChiTiet = $(this).text()
        var objThongSo = new Object();
        objThongSo.titlePara = titleThongSo
        objThongSo.contentPara = titleChiTiet
        listThongSo.push(objThongSo)
      })

      //Content
      var ds3 = $(body).find('.box_content .left_content');
      ds3.each(function (i, e) {
        characteristics = $(this).find('.characteristics h2').text()
        h2 = $(this).find('.boxArticle .area_article h2').text();
        video = $(this).find('.boxArticle .area_article .video').attr('src');
        p = $(this).find('.boxArticle .area_article p').text()
        var image = $(this).find('.boxArticle .area_article p').each(function (i, e) {
          var k = $(this).find('.preventdefault').attr('href')
          var k1 = $(this).text()
          var objDetailContent = new Object();
          objDetailContent.title = k1,
          objDetailContent.image = k
          detailContent.push(objDetailContent)
        })

        //Slider
        var item1 = $(this).find('.characteristics #owl-detail .item img').each(function (i, e) {
          var ee = $(this).attr('data-src')
          slider.push(ee)
        })
      })

      var detailPhone = new DetailPhone({
        title: title,
        sale:sale,
        rating: rating,
        numberRating: numberRating,
        price: price,
        listSale: listKhuyenMai,
        listExtraProduct: listExtra,
        listParameter: listThongSo,
        slider: slider,
        titleH2:h2,
        titleContent: characteristics,
        linkVideo: video,
        topContentP:p,
        detailContent: detailContent
      });

      detailPhone.save(function (err, createDetail) {
        if (err) {
          console.log("error")
        } else {
          console.log("success")
        }
      })
    }
  })
})

app.get('/getDetailPhoneItem/', function (req, res) {
  DetailPhone.find(function (err, detailPhone) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        DetailPhone: detailPhone
      });
    }
  });
})

//CrawlItem
var urlMobile = "https://www.thegioididong.com/dtdd-samsung";
request(urlMobile, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body)
    var ds = $(body).find('.homeproduct li a')
    //console.log(ds.length)
    ds.each(function (i, e) {
      var image = $(this).find('img').attr('data-original')
      if (image === undefined) {
        image = $(this).find('img').attr('src')
      }

      var title = $(this).find('h3').text()
      var price = $(this).find('.price').text()
      var ratting = $(this).find('.ratingresult .icontgdd-ystar').length
      var numberRating = $(this).find('.ratingresult').text().replace("            ", '').trim();
      var description = $(this).find('p').text()
      var deal = $(this).find('label').text()
      var info = $(this).find('.bginfo').text()

      var phoneProduct = new PhoneProduct({
        type: 'motorola',
        name: title,
        price: price,
        description: description,
        deal: deal,
        image: image,
        rating: ratting,
        numberRating: numberRating,
        info: info
      });

      // phoneProduct.save(function (err, createPhoneProduct) {
      //   if (err) {
      //     console.log("error")
      //   } else {
      //     //console.log("success")
      //   }
      // })
    })
  } else {
    console.log('error')
  }
})

app.get('/getPhoneProduct/:type', function (req, res) {
  PhoneProduct.find({
    "type": req.params.type
  }, function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

app.get('/getPhoneProduct/', function (req, res) {
  PhoneProduct.find(function (err, phoneProduct) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        PhoneProduct: phoneProduct
      });
    }
  });
})

// app.post('/createCategoryProduct',function(req,res){
//   var body = req.body;
//   var imageValue = body.imageCategory
//   var type = body.type

//   var category = new PhoneCategory({
//     imageCategory:imageValue,
//     type: type
//   })

//   category.save(function (err, createCategory) {
//     if (err) {
//       res.json({ "success": 0, "message": "Could not add record: " + err });
//     } else {
//       res.json(createCategory);
//     }
//   });
// })

app.post('/createCategory', function (req, res) {
  var body = req.body;
  var imageValue = body.imageCategory;
})

//Create Food
app.post('/createFood', function (req, res) {
  var body = req.body;

  // var idValue = body.id;
  var nameValue = body.name;
  var authorValue = body.author;
  var imageShowValue = body.imageShow;
  var typeValue = body.type;
  var timeValue = body.time;
  var setsValue = body.sets;
  var levelValue = body.level;
  var ratingValue = body.rating;
  var rateNumValue = body.rateNum;
  var materialValue = body.material;
  var cookValue = body.cook;
  var listRateValue = body.listRate;
  var authorNameValue = body.authorName;

  var food = new Food({
    // id:idValue,
    name: nameValue,
    author: authorValue,
    imageShow: imageShowValue,
    type: typeValue,
    time: timeValue,
    sets: setsValue,
    level: levelValue,
    rating: ratingValue,
    rateNum: rateNumValue,
    material: materialValue,
    cook: cookValue,
    listRate: listRateValue,
    authorName: authorNameValue
  });


  food.save(function (err, createdFood) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createdFood);
    }
  });
});

// var timer = setInterval(function() {
//   return Crawler();
// }, 5000);

//Get all Category Phone
app.get('/getAllCategoryPhone', function (req, res) {
  PhoneCategory.find(function (err, categoryPhones) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send({
        Category: categoryPhones
      });
    }
  });
});

app.put('/updateUser/:userId', function (req, res) {
  // User.findById(req.params.userId, function (err, user) {
  UserInfo.findOne({
    'idFb': req.params.userId
  }, function (err, user) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.

      // user.idFb = req.body.idFb || user.idFb;
      user.avatar = req.body.avatar || user.avatar;
      user.fullname = req.body.fullname || user.fullname;
      user.userFollow = req.body.userFollow || user.userFollow;
      user.listNews = req.body.listNews || user.listNews;
      user.userFollow = req.body.userFollow || user.userFollow;

      // Save the updated document back to the database
      user.save(function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(user);
        }
      });
    }
  });
});

//Create User
app.post('/create_user', function (req, res) {
  var body = req.body;

  UserInfo.findOne({
    'idFb': body.idFb
  }, function (err, user) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      if (user) {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.

        // user.idFb = req.body.idFb || user.idFb;

        // Save the updated document back to the database
        user.save(function (err, user) {
          if (err) {
            res.json({
              "success": 0,
              "message": "Could not update record: " + err
            });
          } else {
            res.json(user);
            console.log("co user roi")
          }
        });
      } else {
        // var idValue = body.id;
        var idValue = body.idFb;
        var avaValue = body.avatar;
        var nameValue = body.fullname;
        var numFollowValue = body.numFollow;
        var userFollowValue = body.userFollow;
        var dateValue = body.date;
        var listNewsValue = body.listNews;

        var user = new UserInfo({
          // id:idValue,
          idFb: idValue,
          avatar: avaValue,
          fullname: nameValue,
          numFollow: numFollowValue,
          userFollow: userFollowValue,
          date: dateValue,
          listNews: listNewsValue
        });
        user.save(function (err, createdUser) {
          if (err) {
            res.json({
              "success": 0,
              "message": "Could not add record: " + err
            });
          } else {
            res.json(createdUser);
          }
        });
      }
    }
  });
});

//Get All User
app.get('/get_all_user', function (req, res) {
  UserInfo.find(function (err, users) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send(users);
    }
  });
});

//GetProfile User
app.get('/getUserProfile/:userId', function (req, res) {
  UserInfo.findOne({
    'idFb': req.params.userId
  }, function (err, user) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send(user);
    }
  });
});

//Update User
app.put('/updateUser/:userId', function (req, res) {
  // User.findById(req.params.userId, function (err, user) {
  UserInfo.findOne({
    'idFb': req.params.userId
  }, function (err, user) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.

      // user.idFb = req.body.idFb || user.idFb;
      user.avatar = req.body.avatar || user.avatar;
      user.fullname = req.body.fullname || user.fullname;
      user.userFollow = req.body.userFollow || user.userFollow;
      user.listNews = req.body.listNews || user.listNews;
      user.userFollow = req.body.userFollow || user.userFollow;

      // Save the updated document back to the database
      user.save(function (err, user) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(user);
        }
      });
    }
  });
});

//Search
app.post('/searching', function (req, res) {
  var body = req.body;
  var keySearchFormat = Diacritics.clean(body.keySearch.toLowerCase());
  Food.find(function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      var foodsReturn = [];
      foods.forEach(function (value) {
        var nameFormat = Diacritics.clean(value.name.toLowerCase());
        if (nameFormat.indexOf(keySearchFormat) > -1) {
          foodsReturn.push(value);
        }
      });
      res.json({
        food: foodsReturn
      });
    }
  });
});

//Create Food
app.post('/createFood', function (req, res) {
  var body = req.body;

  // var idValue = body.id;
  var nameValue = body.name;
  var authorValue = body.author;
  var imageShowValue = body.imageShow;
  var typeValue = body.type;
  var timeValue = body.time;
  var setsValue = body.sets;
  var levelValue = body.level;
  var ratingValue = body.rating;
  var rateNumValue = body.rateNum;
  var materialValue = body.material;
  var cookValue = body.cook;
  var listRateValue = body.listRate;
  var authorNameValue = body.authorName;

  var food = new Food({
    // id:idValue,
    name: nameValue,
    author: authorValue,
    imageShow: imageShowValue,
    type: typeValue,
    time: timeValue,
    sets: setsValue,
    level: levelValue,
    rating: ratingValue,
    rateNum: rateNumValue,
    material: materialValue,
    cook: cookValue,
    listRate: listRateValue,
    authorName: authorNameValue
  });


  food.save(function (err, createdFood) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createdFood);
    }
  });
});

//Get Food
app.get('/getFood', function (req, res) {
  Food.find(function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send({
        food: foods
      });
    }
  });
});


//GetTopFood
app.get('/getTopFood', function (req, res) {
  var mysort = {
    rating: -1
  };
  Food.find().sort(mysort).exec(function (err, result) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        food: result
      });
    }
  });
});


//UpdateFood
app.put('/updateFood/:foodId', function (req, res) {
  Food.findById(req.params.foodId, function (err, food) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      // Update each attribute with any possible attribute that may have been submitted in the body of the request
      // If that attribute isn't in the request body, default back to whatever it was before.


      food.name = req.body.name || food.name;
      food.author = req.body.author || food.author;
      food.imageShow = req.body.imageShow || food.imageShow;
      food.type = req.body.type || food.type;
      food.time = req.body.time || food.time;
      food.sets = req.body.sets || food.sets;
      food.level = req.body.level || food.level;
      food.rating = req.body.rating || food.rating;
      food.rateNum = req.body.rateNum || food.rateNum;
      food.material = req.body.material || food.material;
      food.cook = req.body.cook || food.cook;
      food.listRate = req.body.listRate || food.listRate;
      food.authorName = req.body.authorName || food.authorName;

      // Save the updated document back to the database
      food.save(function (err, food) {
        if (err) {
          res.status(500).send(err)
        }
        res.send(food);
      });
    }
  });
});

//Delete Food
app.delete('/deleteFood/:foodId', function (req, res) {
  var foodId = req.params.foodId;

  Food.findByIdAndRemove(foodId, function (error, food) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not delete data from mlab"
      });
    } else {
      res.json({
        "success": 1,
        "message": "Delete succesfully"
      });
    }
  });
});

//GetFood by type
app.get('/getFoodByType/:typeFood', function (req, res) {
  var typeFood = req.params.typeFood;
  Food.find({
    'type': typeFood
  }, function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send({
        food: foods
      });
    }
  });
});


//GetFood by id
app.get('/getFoodById/:idFood', function (req, res) {
  var idFood = req.params.idFood;
  Food.findById(idFood, function (err, food) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send(food);
    }
  });
});

//GetFood by user
app.get('/getFoodByUser/:userId', function (req, res) {
  var userId = req.params.userId;
  Food.find({
    'author': userId
  }, function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      // res.json(foods);
      res.send({
        food: foods
      });
    }
  });
});

//GetFavorite Food
app.get('/getFoodFavorite/:userId', function (req, res) {

  User.findOne({
    'idFb': req.params.userId
  }).populate('listFavorite').exec(function (err, userFound) {
    if (err)
      console.log('Error in view survey codes function');
    if (!userFound || userFound.listFavorite.length < 1)
      res.send('No favorite are yet added.');
    else
      res.send({
        food: userFound.listFavorite
      });
  });
});