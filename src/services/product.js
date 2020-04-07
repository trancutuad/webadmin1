(function () {
    const mongoose = require('mongoose');
    const product = mongoose.model('Products');
    const cate = mongoose.model('Cates');
    const review = mongoose.model('Reviews');

    exports.createProduct = function (product, callback) {
        cate.findOne({cateId : product.cateId},(err,cateId) =>{
            if(cateId != null){
                product.save(product).then((response) => {
                    callback(null, response);
                }, (error) => {
                    callback(error, null);
                });
            }else {
                callback("{err: Cate không tồn tại}",null);
            }
            if(err){
                callback(err,null);
            }
        });
    };
    exports.createReview = function (review, callback) {
        review.save(review).then((response) => {
            callback(null, response);
        }, (error) => {
            callback(error, null);
        });
    };
    exports.deleteProduct = async function (query, callback) {
        const nDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh'
        });

        // cate.deleteOne(query,callback);
        await product.findOneAndUpdate({productId: query},{delete_at : nDate},(err,response)=>{

            callback(err, response);

        });
    };
    exports.selectAll = async function (callback) {
        // const dataProduct = product.find({delete_at : null
        // },(err,data) =>{
           product.aggregate([
               {$lookup:{
                   from: 'cates',
                       localField : 'cateId',
                       foreignField: 'cateId',
                       as: 'cate'
                   }}
           ],(err,res)=>{
               if(err) throw err;
                   callback(err, res);
           });
    }
    exports.selectAllReview = async function (query,callback) {
        // review.find({productId : query},(err,data)=>{
        //     console.log(err);
        //     if (err) throw err;
        //     callback(err,data)
        // });


       //
        review.aggregate([
            {$lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: 'userId',
                    as: 'user'
                }}
        ],function (err,res) {
            if (err) throw err;
           var arr =  Object.entries(res);


            arr.find({productId : query},(err,data)=>{
                callback(err,data);

            })
        });
           // review.aggregate([
           //      {$lookup:{
           //              from: 'users',
           //              localField : 'userId',
           //              foreignField: 'userId',
           //              as: 'user'
           //          }}
           //  ],(err,res)=>{
           //      if(err) throw err;
           //      callback(err, res);
           //     review.find({productId : query},(err,data)=>{
           //         console.log(err);
           //         if (err) throw err;
           //         callback(err,data)
           //     });
           //  });

    }

})();
