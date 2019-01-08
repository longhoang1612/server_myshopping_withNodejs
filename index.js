var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Diacritics = require('diacritic');
var request = require('request');
var cheerio = require('cheerio');

//import model
var PhoneCategory = require('./models/PhoneCategory')
var PhoneProduct = require('./models/PhoneProduct')
var NewsFeed = require('./models/NewsFeed')
var Order = require('./models/Order')
var RegisterUser = require('./models/RegisterUser')
var Comment = require('./models/Comment')

//LOGIN
var ObjectID = mongoose.ObjectID
var crypto = require('crypto')

//CREATE FUNCTION TO RANDOM SALT
var genRandomString = function(length){
  return crypto.randomBytes(Math.ceil(length/2))
                .toString('hex'.slice(0,length));
}

var sha512 = function(password,salt){
  var hash = crypto.createHmac('sha512',salt);
  hash.update(password);
  var value = hash.digest('hex');
  return{
    salt:salt,
    passwordHash:value
  }
}

function saltHashPassword(userPassword){
  var salt = genRandomString(16);
  var passwordData = sha512(userPassword,salt);
  return passwordData;
}

function checkHashPassword(userPassword,salt){
  var passwordData = sha512(userPassword,salt)
  return passwordData;
}

//MONGO CLIENT
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://hoanglong96:hoanglong96@ds111618.mlab.com:11618/hoanglongdb', {
  useMongoClient: true
});

//Set port 
var app = express();
app.set('port', (process.env.PORT || 8888));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});

//API LOGIN
app.post('/register',(request,response,next)=>{
  var post_data = request.body;
  var plaint_password = post_data.password;
  var hash_data = saltHashPassword(plaint_password);

  var password = hash_data.passwordHash;

  var salt = hash_data.salt;
  var fullname = post_data.fullname;
  var email = post_data.email;
  var sex = post_data.sex;
  var dateJoin = post_data.dateJoin;

  var insertJson = new RegisterUser({
    email:email,
    password:password,
    salt:salt,
    fullname:fullname,
    sex:sex,
    dateJoin: dateJoin
  });

  RegisterUser.find({'email':email}).count(function(err,number){
    if(number!=0){
      response.json({
        statusCode:101,
        message:"Email already exists"
      })
    }else{
      insertJson.save(function(error,res){
        if(error){
          response.json({
            statusCode:104,
            message:"Registrantion error"
          })
        }else{
          response.json(res)
        }
      })
    }
  })

});

app.post('/login',function(request,response,next){
  var body = request.body;
  var email = body.email;
  var userPassword = body.password;

  RegisterUser.find({'email':email}).count(function(err,number){
    if(number==0){
      response.json('Email not exists')
    }else{
      RegisterUser.findOne({'email':email},function(err,user){
        var salt = user.salt;
        var hash_password = checkHashPassword(userPassword,salt).passwordHash;
        var encrypted_password = user.password;
        if(hash_password = encrypted_password){
          response.json(user)
        }
      });
    }
  });
});

app.get('/getUser',function(error,response){
  RegisterUser.find(function (err, userRegister) {
    if (err) {
      response.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      response.send(userRegister);
    }
  })
});
//END API LOGIN

//API HOME
app.get('/getHome/', function (req, res) {
  NewsFeed.find(function (err, newsFeed) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        NewsFeed: newsFeed
      });
    }
  });
})
//END API HOME

//API PRODUCT
app.get('/getPhoneWithType/:type', function (req, res) {
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

app.get('/deletePhoneType/:type', function (req, res) {
  PhoneProduct.deleteMany({
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

app.get('/getPhoneProduct/:title', function (req, res) {
  PhoneProduct.find({
    "title": req.params.title
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

app.get('/getPhoneCategory/:typeCategory', function (req, res) {
  PhoneProduct.find({
    "typeCategory": req.params.typeCategory
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

app.post('/createCategoryPhone', function (req, res) {
  var body = req.body;
  var imageValue = body.imageCategory
  var type = body.type

  var category = new PhoneCategory({
    imageCategory: imageValue,
    type: type
  })

  category.save(function (err, createCategory) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createCategory);
    }
  });
})

//Get Category with TypeCategory
app.get('/getCategory/:typeCategory', function (req, res) {
  PhoneCategory.find({
    "typeCategory": req.params.typeCategory
  }, function (err, categoryPhones) {
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
//API END PRODUCT

//Create Product
app.post('/createProduct', function (req, res) {
  var body = req.body;

  var typeCategoryValue = body.typeCategory;
  var typeValue = body.type;
  var priceValue = body.price;
  var hispriceValue = body.hisprice;
  var dealValue = body.deal;
  var imageValue = body.image;
  var ratingValue = body.rating;
  var titleValue = body.title;
  var numberRatingValue = body.numberRating;
  var listSaleValue = body.listSale;
  var listExtraProductValue = body.listExtraProduct;
  var listParameterValue = body.listParameter;
  var titleH2Value = body.titleH2;
  var titleContentValue = body.titleContent;
  var linkVideoValue = body.linkVideo;
  var topContentPValue = body.topContentP;
  var detailContentValue = body.detailContent;
  var listCongDungValue = body.listCongDung;
  var sliderValue = body.slider;

  var phoneProduct = new PhoneProduct({
    typeCategory:typeCategoryValue,
    type: typeValue,
    price: priceValue,
    hisprice:hispriceValue,
    deal:dealValue,
    image: imageValue,
    rating : ratingValue,
    title: titleValue,
    numberRating: numberRatingValue,
    listSale: listSaleValue,
    listExtraProduct:listExtraProductValue,
    listParameter:listParameterValue,
    titleH2:titleH2Value,
    titleContent:titleContentValue,
    linkVideo: linkVideoValue,
    topContentP:topContentPValue,
    detailContent:detailContentValue,
    listCongDung:listCongDungValue,
    slider:sliderValue
  });


  phoneProduct.save(function (err, createProduct) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createProduct);
    }
  });
});

//Create Comment
app.post('/createComment', function (req, res) {
  var body = req.body;

  var date = body.date;
  var idProduct = body.idProduct;
  var nameProduct = body.nameProduct;
  var nameUser = body.nameUser;
  var imageComment = body.imageComment;
  var titleComment = body.titleComment;
  var comment = body.comment;
  var rating = body.rating;

  var commentProduct = new Comment({
    date:date,
    idProduct: idProduct,
    nameProduct: nameProduct,
    nameUser:nameUser,
    imageComment:imageComment,
    titleComment: titleComment,
    comment : comment,
    rating: rating,
  });


  commentProduct.save(function (err, createComment) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createComment);
    }
  });
});

app.get('/getComment/:idProduct', function (req, res) {
  Comment.find({
    "idProduct": req.params.idProduct
  }, function (err, createComment) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        Comment: createComment
      });
    }
  });
});

app.get('/getAllComment', function (req, res) {
  Comment.find(function (err, createComment) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        Comment: createComment
      });
    }
  });
});

//Create Order
app.post('/createOrder', function (req, res) {
  var body = req.body;

  var idUserValue = body.idUser;
  var typeOrderValue = body.typeOrder;
  var dateOrderValue = body.dateOrder;
  var statusOrderValue = body.statusOrder;
  var addressUserValue = body.addressUser;
  var nameUserValue = body.nameUser;
  var phoneNumberValue = body.phoneNumber;
  var typePaymentValue = body.typePayment;
  var cartValue = body.cart;

  var order = new Order({
    idUser:idUserValue,
    typeOrder: typeOrderValue,
    dateOrder:dateOrderValue,
    statusOrder:statusOrderValue,
    addressUser: addressUserValue,
    nameUser:nameUserValue,
    phoneNumber:phoneNumberValue,
    typePayment:typePaymentValue,
    cart: cartValue
  });


  order.save(function (err, createOrder) {
    if (err) {
      res.json({
        "success": 0,
        "message": "Could not add record: " + err
      });
    } else {
      res.json(createOrder);
    }
  });
});

//Get All Order
app.get('/getOrder', function (req, res) {
  Order.find(function (err, order) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({Orders : order});
    }
  });
});

//Get Order with idUser
app.get('/getOrder/:idUser', function (req, res) {
  Order.find({
    "idUser": req.params.idUser
  }, function (err, orderProducts) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({
        Orders: orderProducts
      });
    }
  });
});

app.get('/getOrderByID/:idOrder', function (req, res) {
  Order.findOne({
    "_id": req.params.idOrder
  }, function (err, orderProducts) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send(orderProducts);
    }
  });
});

app.get('/getOrderByStatus/:statusOrder', function (req, res) {
  Order.find({
    "statusOrder": req.params.statusOrder
  }, function (err, orderProducts) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      res.send({Orders: orderProducts});
    }
  });
});

//Update Order
app.put('/updateOrder/:idOrder', function (req, res) {
  Order.findOne({
    '_id': req.params.idOrder
  }, function (err, order) {
    // Handle any possible database errors
    if (err) {
      res.status(500).send(err);
    } else {
      order.statusOrder = req.body.statusOrder || order.statusOrder

      order.save(function (err, order) {
        if (err) {
          res.status(500).send(err)
        } else {
          res.send(order);
        }
      });
    }
  });
});

//Update Favorites Item with User
app.put('/updateFavorites/:email', function (req, res) {
  RegisterUser.findOne({
    'email': req.params.email
  }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else { 
      user.favorites = req.body.favorites || user.favorites;
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

//GetProfile User
app.get('/getUserProfile/:email', function (req, res) {
  RegisterUser.findOne({
    'email': req.params.email
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

//Update Address User
app.put('/updateAddressUser/:email', function (req, res) {
  RegisterUser.findOne({
    'email': req.params.email
  }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
    
      user.address = req.body.address || user.address;

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

//Update Info User
app.put('/updateInfo/:email', function (req, res) {
  RegisterUser.findOne({
    'email': req.params.email
  }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
      
      user.fullname = req.body.fullname || user.fullname;
      user.address = req.body.address || user.address;
      user.birthday = req.body.birthday || user.birthday;
      user.sex = req.body.sex || user.sex; 

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

//Update Current Cart
app.put('/cartUpload/:email', function (req, res) {
  RegisterUser.findOne({
    'email': req.params.email
  }, function (err, user) {
    if (err) {
      res.status(500).send(err);
    } else {
    
      user.cartCurrent = req.body.cartCurrent || user.cartCurrent;

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
app.post('/searchItems', function (req, res) {
  var body = req.body;
  var keySearchFormat = body.keySearch.toLowerCase();

  PhoneProduct.find(function (err, foods) {
    if (err) {
      res.json({
        success: 0,
        message: "Could not get data from mlab"
      });
    } else {
      var productReturn = [];
      foods.filter(function (value) {
        var nameFormat = value.title.toLowerCase();
        if (nameFormat.indexOf(keySearchFormat) !== -1) {
          productReturn.push(value);
        }
      });
      res.json({
        PhoneProduct: productReturn
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

//Delete Product with ID
app.get('/deleteProduct/:idProduct', function (req, res) {
  var productID = req.params.idProduct;

  PhoneProduct.findByIdAndRemove(productID, function (error, product) {
    if (error) {
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

//Delete Comment with ID
app.get('/deleteComment/:idComment', function (req, res) {
  var commentId = req.params.idProduct;

  Comment.findByIdAndRemove({
    '_id': req.params.idComment}, function (error, comment) {
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
