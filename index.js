
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
var NewsFeed = require('./models/newsfeed');
var NhomTu = require('./models/nhomTu');
var TuTrongNhomTu = require('./models/TuVung')
var MeoToeic = require('./models/meoToeic')
var LuyenNghe = require('./models/luyenNgheMoiNgay')
var DetailLuyenNghe = require('./models/detailLuyenNghe')
var NguPhap = require('./models/nguPhapCoBan')
var CachLam = require('./models/cachLamBaiThiToeic')
var FunnyEnglish = require('./models/funnyEnglish')
var NguPhapSoCap = require('./models/NguPhapSoCap')
var NguPhapTrungCap = require('./models/NguPhapTrungCap')
var NguPhapCaoCap = require('./models/NguPhapCaoCap')
var PhoneCategory = require('./models/PhoneCategory')
var PhoneProduct = require('./models/PhoneProduct')
var arrWord = new Array();
var arrNghia = new Array();
var app = express();
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hoanglong96:hoanglong96@ds111618.mlab.com:11618/hoanglongdb'
  , { useMongoClient: true });

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

var checkCount = function(){
  console.log("hihi")
}

//crawl category
var urlCategory = "https://www.thegioididong.com/dtdd";
request(urlCategory,function(err,res,body){
  if(!err && res.statusCode == 200){
    $ = cheerio.load(body)
    var ds = $(body).find('.manuwrap .manunew a img');
        ds.each(function(i,e){
          var phoneCategory = new PhoneCategory({
            image: 'https:'+$(this).attr('src'),
            href: $(this).find('href')
          });
        
          phoneCategory.save(function (err, createdPhoneCategory) {
            if (err) {
              //res.json({ "success": 0, "message": "Could not add record: " + err });
            } else {
              console.log(createdPhoneCategory)
              //res.json(createdPhoneCategory);
            }
          });
    })
  }
})

//crawl detail item
var urlItemDetail = "https://www.thegioididong.com/dtdd/samsung-galaxy-note-9";
request(urlItemDetail,function(err,res,body){
  if(!err && res.statusCode == 200){
    var title;
    var ratting;
    var numberRatting;
    var image;
    var price;
    var khuyenmai;
    var listKhuyenMai = [String]
    var $ = cheerio.load(body)
    var ds = $(body).find('.rowtop')
    ds.each(function(i,e){
      title = $(this).find('h1').text()
      ratting = $(this).find('.ratingresult .star').length
      numberRatting = $(this).find('.ratingresult a').text()
    })

    var ds1 = $(body).find('.rowdetail')
    ds1.each(function(i,e){
      image = $(this).find('.picture img').attr('src')
      price = $(this).find('.price_sale .area_price').text()
      khuyenmai = $(this).find('.price_sale .area_promotion .infopr span').each(function(i,e){
        var km = $(this).text()
        listKhuyenMai.push(km)
      })
    })

    var ds2 = $(body).find('.gamecombo ul')
    ds2.each(function(i,e){
        var item = $(this).text()
        //console.log(item)
    })

    var ds3 = $(body).find('.box_content .left_content').each(function(i,e){
      var characteristics = $(this).find('.characteristics h2').text()
      var item1 = $(this).find('.characteristics #owl-detail .item img').each(function(i,e){
        var ee = $(this).attr('data-src')
        console.log(ee)
      })
    })
  }
})

//CrawlItem
var urlMobile = "https://www.thegioididong.com/dtdd-motorola";
request(urlMobile,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)
    var ds = $(body).find('.homeproduct li a')
    //console.log(ds.length)
    ds.each(function(i,e){
      var image = $(this).find('img').attr('data-original')
      if(image===undefined){
        image = $(this).find('img').attr('src')
      }

      var linkUrl = $(this).attr('href')
      //console.log(linkUrl)
      var title = $(this).find('h3').text()
      var price = $(this).find('.price').text()
      var ratting = $(this).find('.ratingresult .icontgdd-ystar').length
      var numberRating = $(this).find('.ratingresult').text().replace("            ",'').trim();
      var description = $(this).find('p').text()
      var deal = $(this).find('label').text()
      var info = $(this).find('.bginfo').text()
      
      var phoneProduct = new PhoneProduct({
        type:'motorola',
        name: title,
        price: price,
        description: description,
        deal:deal,
        image: image,
        rating : ratting,
        numberRating: numberRating,
        info:info
      });
    
      phoneProduct.save(function (err, createPhoneProduct) {
        if (err) {
          console.log("error")
        } else {
          //console.log("success")
        }
      })
  })
  }else{
    console.log('error')
  }
})

app.get('/getPhoneProduct',function(req,res){
  PhoneProduct.find(function (err, phoneProduct) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send(phoneProduct);
    }
  });
})

app.post('/createCategoryProduct',function(req,res){
  var body = req.body;
  var imageValue = body.imageCategory
  var type = body.type

  var category = new PhoneCategory({
    imageCategory:imageValue,
    type: type
  })

  category.save(function (err, createCategory) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      res.json(createCategory);
    }
  });
})

app.post('/createCategory',function(req,res){
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
      res.json({ "success": 0, "message": "Could not add record: " + err });
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
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send(categoryPhones);
    }
  });
});

//Get all funny English
app.get('/getPhone/:idCategory', function (req, res) {
  PhoneCategory.findOne({"idCategory":req.params.idCategory},function (err, phoneCategory) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({phoneCategory});
    }
  });
});

app.put('/updateUser/:userId', function (req, res) {
  // User.findById(req.params.userId, function (err, user) {
  UserInfo.findOne({ 'idFb': req.params.userId }, function (err, user) {
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


//crawl funny english
var urlFunnyEnglish = "http://www.mshoatoeic.com/funny-english-nl37";
request(urlFunnyEnglish,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)
      var a = $('.main_content .clearfix .img_news a img').each(function(k,elems){
          var b = $(this).attr('src')
          var titleFunny = $(this).attr('alt')
          
          var funny = new FunnyEnglish({
            id: k+1,
            title : titleFunny,
            image: b
          })

          // funny.save(function(err,postFunny){
          //   if(err){
          //     console.log('error')
          //   }else{
          //     console.log('success')
          //   }
          // })
      })
    //console.log(arr)

  }else{
    console.log('error')
  }
})

//Get all funny English
app.get('/funnyEnglish', function (req, res) {
  FunnyEnglish.find(function (err, funny) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ FunnyEnglish: funny });
    }
  });
});

//crawl nhom tu vung
var urlNhomTuVung = "http://600tuvungtoeic.com/";
request(urlNhomTuVung, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body);

    var arrImage = new Array()
    var arrContent = new Array()
    var arrLink = new Array()
    var idNhomTu = 0;

    var title = $('.overlay a').each(function (i, elem) {
      var link = "http://600tuvungtoeic.com/" + $(this).attr('href')
      // request(link,function(er,response,body){
      //   if(!err && response.statusCode == 200){
      //     var $ = cheerio.load(body);
      //     var hinhanh = $('.hinhanh img').each(function(i,elem){
      //       var linkAnhTuVung = $(this).attr('src')
      //       console.log(linkAnhTuVung)
      //     })
      //   }
      // })
      arrLink.push(link)
    })

    var image = $('.gallery-item img').each(function (i, elem) {
      var imagelink = $(this).attr('src')
      arrImage.push(imagelink)
    })

    var content = $('.content-gallery h3').each(function (i, elem) {
      var contentNhomTu = $(this).text()
      arrContent.push(contentNhomTu)
    })

    for (var i = 0; i < arrImage.length; i++) {
      var nhomTu = new NhomTu({
        idNhomTu: i + 1,
        tenNhomTu: arrContent[i],
        anhMinhHoa: arrImage[i],
      })

      // nhomTu.save(function (err, taoNhomTu) {
      //   //console.log("save " + title)
      //   if (err) {
      //     console.log("error")
      //   } else {
      //     console.log("success")
      //   }
      // })
    }

    var arrIdNhom = new Array();
    for (var i = 0; i < arrLink.length; i++) {
      arrIdNhom.push(index)
    }

    for (var index = 0; index < arrLink.length; index++) {
      var urlLinkNhomTu = arrLink[index]
      arrIdNhom.push(index)
      request(urlLinkNhomTu, function (err, response, body) {
        if (!err && response.statusCode == 200) {
          var $ = cheerio.load(body);

          var arrNoiDungTu = new Array();
          var arrImageTu = new Array();
          var arrAudio = new Array();

          var hinhanhtu = $('.hinhanh img').each(function (i, elem) {
            var imageTu = $(this).attr('src')
            arrImageTu.push(imageTu)
          })
          var tu = $('.noidung').each(function (i, elem) {
            var noidungTu = $(this).text()
            arrNoiDungTu.push(noidungTu)
          })

          var audio = $('.noidung audio source').each(function (i, elem) {
            var audioTu = $(this).attr('src')
            arrAudio.push(audioTu)
          })


          for (var i = 0; i < arrAudio.length; i++) {
            //console.log(index)
            var tuVung = new TuTrongNhomTu({
              id: index * 12 + i + 1,
              content: arrNoiDungTu[i],
              idNhomTu: index + 1,
              image: arrImageTu[i],
              audio: arrAudio[i]
            })

            // tuVung.save(function (err, taoTuVung) {
            //   if (err) {
            //     console.log("error" + err)
            //   } else {
            //     console.log("success")
            //   }
            // })
          }
        } else {
          console.log('error')
        }
      })
    }


  } else {
    console.log('error')
  }
})

//crawl Cach lam bai thi toeic
var urlCachLam = "https://www.toeicmoingay.com/#bai-giang";
request(urlCachLam,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)
     
    var title = $('#tab2_Category .eachSectionTitle').text()
    var desktopDevices = $('#tab2_Category .desktopDevices a').each(function(i,elem){
      var desktopDevices1 = $(this).text()
  
    
      var urlChitietNguPhap = $(this).attr('href');
      request(urlChitietNguPhap,function(err,response,body){
        var $ = cheerio.load(body)
        var titleChitiet = $('.contentOuter iframe').attr('src').split(';')
  

        var cachlam = new CachLam({
          id: i+1,
          title: desktopDevices1,
          linkVideo: titleChitiet[0]
        })

        //   cachlam.save(function(err,taoCachLam){
        //   //console.log("save " + title)
        //   if(err){
        //     console.log("error")
        //   }else{
        //     console.log(i + "success")
        //   }
        // })
      })
    })
  }else{
    console.log('error')
  }
})

//Get All cach lam bai thi toeic
app.get('/getCachLam', function (req, res) {
  CachLam.find(function (err, cachlam) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ CachLam: cachlam });
    }
  });
});

//crawl data luyen nghe moi ngay
var urlLuyenNghe = "https://nghetienganhpro.com/category/luyen-nghe-moi-ngay/";
request(urlLuyenNghe, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body)

    var title = new Array()
    var imageNghe = new Array()
    var linkNghe = new Array()

    //image
    var imgNghe = $('.blog-item-wrap a img').each(function (i, elem) {
      var ngheMoiNgay = $(this).attr('src')
      //console.log(ngheMoiNgay)
      imageNghe.push(ngheMoiNgay)
    })
    //Title,Link
    var textTitle = $('.entry-title a').each(function (i, elem) {
      var linkMoiNgay = $(this).attr('href')
      var titleMoiNgay = $(this).text()
      title.push(titleMoiNgay)
      linkNghe.push(linkMoiNgay)
      //console.log(titleMoiNgay)
    })

    //Content
    var contentMoiNgay = new Array();

    var textContent = $('.entry-content').each(function (i, elem) {
      var content = $(this).text().split('\t')
      for (var i = 0; i < content.length; i++) {
        if (content[i] == '\n\n' || content[i] == '' || content[i] == 'Đọc tiếp\n\n') {

        } else {
          contentMoiNgay.push(content[i])
        }
      }
      //console.log(content)
    })

    console.log(contentMoiNgay.length)

    for (var i = 0; i < contentMoiNgay.length; i++) {
      var luyennghe = new LuyenNghe({
        idLuyenNghe: i + 1,
        title: title[i],
        content: contentMoiNgay[i],
        image: imageNghe[i]
      });

      // luyennghe.save(function (err, taoLuyenNghe) {
      //   if (err) {
      //     console.log('error')
      //   } else {
      //     console.log('success')
      //   }
      // })
    }

  } else {
    console.log('error')
  }
})

//POST LUYEN NGHE
app.post('/taoLuyenNghe', function (req, res) {
  var body = req.body;
  DetailLuyenNghe.findOne({ 'idLuyenNghe': body.idLuyenNghe }, function (err, detailNghe) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      if (detailNghe) {
        detailNghe.save(function (err, chitiet) {
          if (err) {
            res.json({ "success": 0, "message": "Could not update record: " + err });
          } else {
            res.json({ chitiet })
          }
        });
      } else {
        var id1 = body.idLuyenNghe;
        var title1 = body.title;
        var content1 = body.content;
        var link1 = body.link;
        var transcript1 = body.transcript;
        var tuvung1 = body.tuvung
        var image1 = body.image
        var quantam1 = body.quantam

        var detail = new DetailLuyenNghe({
          idLuyenNghe: id1,
          title: title1,
          content: content1,
          link: link1,
          transcript: transcript1,
          tuvung: tuvung1,
          image: image1,
          quantam: quantam1
        });

        detail.save(function (err, chiteitNghe) {
          if (err) {
            res.json({ "success": 0, "message": "Could not add record: " + err })
          } else {
            res.json(chiteitNghe)
          }
        })
      }
    }
  })

})

//Get All Detail Luyen nghe
app.get('/getDetailNghe', function (req, res) {
  DetailLuyenNghe.find(function (err, luyenNghe) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ LuyenNghe: luyenNghe });
    }
  });
});

//Get Detail LuyenNghe
app.get('/getDetailNghe/:idLuyenNghe', function (req, res) {
  var id = req.params.idLuyenNghe;
  console.log(id)
  DetailLuyenNghe.find({ idLuyenNghe: req.params.idLuyenNghe }, function (err, detailNghe) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({detailNghe });
    }
  });
});

//crawl ngữ pháp trình độ sơ cấp
var urlSoCap = 'http://bktoeic.edu.vn/ngu-phap-tieng-anh/ngu-phap-tieng-anh-trinh-do-so-cap/page/1/';
request(urlSoCap,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)
    
    var arrSoCapImage = new Array();
    var arrSoCapTitle = new Array();
    var arrSoCapDesc = new Array();

    var imageSoCap = $('.posts-listing article a img').each(function(i,elem){
      var image = $(this).attr('src')
      arrSoCapImage.push(image)
    })

    var titleSoCap = $('.posts-listing article h1').each(function(i,elem){
      var title = $(this).text()
      arrSoCapTitle.push(title)
    })

    var descSoCap = $('.posts-listing article p').each(function(i,elem){
      var desc = $(this).text()
      arrSoCapDesc.push(desc)
    })
  }

  for(var i=0;i<titleSoCap.length;i++){
      var soCap = new NguPhapSoCap({
          idSoCap: i+1,
          title:arrSoCapTitle[i],
          image:arrSoCapImage[i],
          desc:arrSoCapDesc[i]
      })

      // soCap.save(function(err,taoSoCap){
      //   if(err){
      //     console.log('err')
      //   }else{
      //     console.log('success')
      //   }
      // })
  }
})

//crawl ngữ pháp trình độ trung cấp
var urlSoCap = 'http://bktoeic.edu.vn/ngu-phap-tieng-anh/ngu-phap-tieng-anh-trinh-do-trung-cap/';
request(urlSoCap,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)
    
    var arrTrungCapImage = new Array();
    var arrTrungCapTitle = new Array();
    var arrTrungCapDesc = new Array();

    var imageTrungCap = $('.posts-listing article a img').each(function(i,elem){
      var image = $(this).attr('src')
      arrTrungCapImage.push(image)
    })

    var titleTrungCap = $('.posts-listing article h1').each(function(i,elem){
      var title = $(this).text()
      arrTrungCapTitle.push(title)
    })

    var descTrungCap = $('.posts-listing article p').each(function(i,elem){
      var desc = $(this).text()
      arrTrungCapDesc.push(desc)
    })
  }

  for(var i=0;i<titleTrungCap.length;i++){
      var trungCap= new NguPhapTrungCap({
          idTrungCap: i+1,
          title:arrTrungCapTitle[i],
          image:arrTrungCapImage[i],
          desc:arrTrungCapDesc[i]
      })

      // trungCap.save(function(err,taoTrungCap){
      //   if(err){
      //     console.log('err')
      //   }else{
      //     console.log('success')
      //   }
      // })
  }
})

//crawl ngữ pháp trình độ cap cấp
var urlSoCap = 'http://bktoeic.edu.vn/ngu-phap-tieng-anh/ngu-phap-tieng-anh-trinh-do-nang-cao/';
request(urlSoCap,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)
    
    var arrCaoCapImage = new Array();
    var arrCaoCapTitle = new Array();
    var arrCaoCapDesc = new Array();

    var imageCaoCap = $('.posts-listing article a img').each(function(i,elem){
      var image = $(this).attr('src')
      arrCaoCapImage.push(image)
    })

    var titleCaoCap = $('.posts-listing article h1').each(function(i,elem){
      var title = $(this).text()
      arrCaoCapTitle.push(title)
    })

    var descCaoCap = $('.posts-listing article p').each(function(i,elem){
      var desc = $(this).text()
      arrCaoCapDesc.push(desc)
    })
  }

  for(var i=0;i<titleCaoCap.length;i++){
      var caoCap= new NguPhapCaoCap({
          idCaoCap: i+1,
          title:arrCaoCapTitle[i],
          image:arrCaoCapImage[i],
          desc:arrCaoCapDesc[i]
      })

      // caoCap.save(function(err,taoCaoCap){
      //   if(err){
      //     console.log('err')
      //   }else{
      //     console.log('success')
      //   }
      // })
  }
})

//Get All So Cap
app.get('/getSoCap', function (req, res) {
  NguPhapSoCap.find(function (err, socap) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" })
    } else {
      res.send({ SoCap: socap })
    }
  })
})

//Get All TrungCap
app.get('/getTrungCap',function(req,res){
  NguPhapTrungCap.find(function(err,trungcap){
    if(err){
      res.json({success:0,message:"Could not get data from mlab"})
    }else{
      res.send({TrungCap: trungcap})
    }
  })
})
//Get All CaoCap
app.get('/getCaoCap',function(req,res){
  NguPhapCaoCap.find(function(err,caocap){
    if(err){
      res.json({success:0,message:"Could not get data from mlab"})
    }else{
      res.send({CaoCap: caocap})
    }
  })
})

//crawl nguphap co ban
var urlNguPhap = 'https://www.toeicmoingay.com/#bai-giang';
request(urlNguPhap,function(err,response,body){
  if(!err && response.statusCode == 200){
    var $ = cheerio.load(body)

    
    var title = $('#tab1_Category .eachSectionTitle').text()
    var desktopDevices = $('#tab1_Category .desktopDevices a').each(function(i,elem){
      var desktopDevices1 = $(this).text()
    
      //afsaf
      var urlChitietNguPhap = $(this).attr('href');
      request(urlChitietNguPhap,function(err,response,body){
        var $ = cheerio.load(body)
        var titleChitiet = $('.contentOuter iframe').attr('src').split(';')

        var nguphap = new NguPhap({
          idNguPhap: i+1,
          title: desktopDevices1,
          linkVideo: titleChitiet[0]
        })

        //   nguphap.save(function(err,taoNguPhap){
        //   //console.log("save " + title)
        //   if(err){
        //     console.log("error")
        //   }else{
        //     console.log("success")
        //   }
        // })

      })
      //safsaf
    })
  }else{
    console.log('error')
  }
})

//Get Detail LuyenNghe
app.get('/getNguPhap/:idNguPhap', function (req, res) {
  var id = req.params.idNguPhap;
  console.log(id)
  NguPhap.find({ idNguPhap: req.params.idNguPhap }, function (err, detailNguPhap) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({detailNguPhap});
    }
  });
});

//get all luyen nghe
app.get('/getNguPhap', function (req, res) {
  NguPhap.find(function (err, nguphap) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" })
    } else {
      res.send({ NguPhap: nguphap })
    }
  })
})


//crawl data meo toeic
var url = 'https://giasutoeic.com/meo-thi-toeic/';

request(url, function (err, response, body) {
  if (!err && response.statusCode == 200) {
    var $ = cheerio.load(body);

    var idMeoToeic = 1;
    var titleMeoToeic;
    var imageMeoToeic;
    var desMeoToeic;

    //crawl title
    var title1 = $('.post-title').text().split("\n");
    var title2 = new Array();
    for (var i = 0; i < title1.length; i++) {
      if (title1[i].length != 0) {
        title2.push(title1[i])
      }
    }

    //crawl desc
    var des1 = $('.post-desc .post-brief-desc').text().split("\n");
    var des2 = new Array();
    for (var i = 0; i < des1.length; i++) {
      if (des1[i].length != 0 && des1[i] !== "Đọc bài này" && des1[i].length != 1 && des1[i] !== " Đọc bài này") {
        des2.push(des1[i])
      }
    }

    //crawl image
    var image2 = new Array();
    var image1 = $('.post-image a img').each(function (i, elem) {
      image2.push($(this).attr('data-cfsrc'))
    })

    for (var i = 0; i < $('.post-image').length; i++) {
      var i1 = $('.post-image img').attr('data-cfsrc')
    }

    //post data
    var length = $('.post-wrapper.clearfix').length;

    for (var i = 0; i < length; i++) {

      MeoToeic.findOne({ 'id': i + 1 }, function (err, meotoeic) {

      })

      var title = title2[i]
      var link = ""
      titleMeoToeic = title;
      imageMeoToeic = "https://giasutoeic.com" + image2[i];
      //console.log(imageMeoToeic)
      desMeoToeic = des2[i];

      var meoToeic = new MeoToeic({
        idMeoToeic: i + 1,
        name: titleMeoToeic,
        des: desMeoToeic,
        image: imageMeoToeic
      })

      // meoToeic.save(function(err,taoMeoToeic){
      //   //console.log("save " + title)
      //   if(err){
      //     console.log("error")
      //   }else{
      //     console.log("success")
      //   }
      // })
    }
  }
  else console.log('Error');
})

//get all meo
app.get('/getMeoToeic', function (req, res) {
  MeoToeic.find(function (err, meoToeic) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ MeoToeic: meoToeic });
    }
  });
});

//get all luyen nghe
app.get('/getLuyenNghe', function (req, res) {
  LuyenNghe.find(function (err, luyenNghe) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" })
    } else {
      res.send({ LuyenNghe: luyenNghe })
    }
  })
})

//post tu 
app.post('/taoTu', function (req, res) {

  for (i in array) {
    if (i % 2 == 0) {
      arrWord.push(array[i])
    } else { i % 2 == 1 } {
      arrNghia.push(array[i])
    }

    var idNhomTu1 = "1"
    var idTu1 = i + ""
    var word1 = arrWord[i]
    var nghia1 = arrNghia[i]

    var TuVung = new TuTrongNhomTu({
      idNhomTu: idNhomTu1,
      idTu: idTu1,
      word: word1,
      nghia: nghia1
    });

    TuVung.save(function (err, taoTu) {
      if (err) {
        res.json({ "success": 0, "message": "Could not add record: " + err })
      } else {
        res.json({ taoTu })
      }
    })
  }
})

//Post nhóm từ
app.post('/create_words', function (req, res) {
  var body = req.body;
  NhomTu.findOne({ 'idNhomTu': body.idNhomTu }, function (err, nhomTu) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      if (nhomTu) {
        nhomTu.save(function (err, nhomTu) {
          if (err) {
            res.json({ "success": 0, "message": "Could not update record: " + err });
          } else {
            res.json({ nhomTu })
          }
        });
      } else {
        var idNhomTu1 = body.idNhomTu;
        var tenNhomTu1 = body.tenNhomTu;
        var anhMinhHoa1 = body.anhMinhHoa;

        var nhomTu = new NhomTu({
          idNhomTu: idNhomTu1,
          tenNhomTu: tenNhomTu1,
          anhMinhHoa: anhMinhHoa1
        });

        nhomTu.save(function (err, createNhomTu) {
          if (err) {
            res.json({ "success": 0, "message": "Could not add record: " + err })
          } else {
            res.json(createNhomTu)
          }
        })
      }
    }
  })

})

//Get all nhomTu
app.get('/getAllNhomTu', function (req, res) {
  NhomTu.find(function (err, nhomTus) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ NhomTu: nhomTus });
    }
  });
});

//Delete NhomTu
app.delete('/delNhomTu/:idNhomTu', function (req, res) {
  var idNhomTu = req.params.idNhomTu;

  NhomTu.findByIdAndRemove(idNhomTu, function (err, nhomTu) {
    if (err) {
      res.json({ "success": 0, "message": "Could not delete data from mlab" });
    } else {
      res.json({ "success": 1, "message": "Delete succesfully" });
    }
  });
});

//Get All Tu trong nhom tu
app.get('/getTuTrongNhom/:idNhomTu', function (req, res) {
  var idNhomTu = req.params.idNhomTu;
  TuTrongNhomTu.find({ idNhomTu: req.params.idNhomTu }, function (err, tuvung) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ tuvung: tuvung });
    }
  });
});

//Get All Tu
app.get('/getAllTu/', function (req, res) {
  TuTrongNhomTu.find(function (err, tu) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" + err });
    } else {
      res.send(tu);
    }
  });
});

//Create User
app.post('/create_user', function (req, res) {
  var body = req.body;

  UserInfo.findOne({ 'idFb': body.idFb }, function (err, user) {
    if (err) {
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      if (user) {
        // Update each attribute with any possible attribute that may have been submitted in the body of the request
        // If that attribute isn't in the request body, default back to whatever it was before.

        // user.idFb = req.body.idFb || user.idFb;

        // Save the updated document back to the database
        user.save(function (err, user) {
          if (err) {
            res.json({ "success": 0, "message": "Could not update record: " + err });
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
            res.json({ "success": 0, "message": "Could not add record: " + err });
          } else {
            res.json(createdUser);
          }
        }
        );
      }
    }
  });
});

//Get All User
app.get('/get_all_user', function (req, res) {
  UserInfo.find(function (err, users) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send(users);
    }
  });
});

//GetProfile User
app.get('/getUserProfile/:userId', function (req, res) {
  UserInfo.findOne({ 'idFb': req.params.userId }, function (err, user) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send(user);
    }
  });
});

//Update User
app.put('/updateUser/:userId', function (req, res) {
  // User.findById(req.params.userId, function (err, user) {
  UserInfo.findOne({ 'idFb': req.params.userId }, function (err, user) {
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
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      var foodsReturn = [];
      foods.forEach(function (value) {
        var nameFormat = Diacritics.clean(value.name.toLowerCase());
        if (nameFormat.indexOf(keySearchFormat) > -1) {
          foodsReturn.push(value);
        }
      });
      res.json({ food: foodsReturn });
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
      res.json({ "success": 0, "message": "Could not add record: " + err });
    } else {
      res.json(createdFood);
    }
  }
  );
});

//Get Food
app.get('/getFood', function (req, res) {
  Food.find(function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send({ food: foods });
    }
  });
});


//GetTopFood
app.get('/getTopFood', function (req, res) {
  var mysort = { rating: -1 };
  Food.find().sort(mysort).exec(function (err, result) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      res.send({ food: result });
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
      res.json({ "success": 0, "message": "Could not delete data from mlab" });
    } else {
      res.json({ "success": 1, "message": "Delete succesfully" });
    }
  });
});

//GetFood by type
app.get('/getFoodByType/:typeFood', function (req, res) {
  var typeFood = req.params.typeFood;
  Food.find({ 'type': typeFood }, function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send({ food: foods });
    }
  });
});


//GetFood by id
app.get('/getFoodById/:idFood', function (req, res) {
  var idFood = req.params.idFood;
  Food.findById(idFood, function (err, food) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send(food);
    }
  });
});

//GetFood by user
app.get('/getFoodByUser/:userId', function (req, res) {
  var userId = req.params.userId;
  Food.find({ 'author': userId }, function (err, foods) {
    if (err) {
      res.json({ success: 0, message: "Could not get data from mlab" });
    } else {
      // res.json(foods);
      res.send({ food: foods });
    }
  });
});

//GetFavorite Food
app.get('/getFoodFavorite/:userId', function (req, res) {

  User.findOne({ 'idFb': req.params.userId }).populate('listFavorite').exec(function (err, userFound) {
    if (err)
      console.log('Error in view survey codes function');
    if (!userFound || userFound.listFavorite.length < 1)
      res.send('No favorite are yet added.');
    else
      res.send({ food: userFound.listFavorite });
  });
});
