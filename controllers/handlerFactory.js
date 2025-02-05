/*eslint-disable*/
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
      },
    });
  });

  const getParam = (id) => {
    return id.includes('@')? filter = { email: id } : filter = { _id: id };
  }

  exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const param = getParam(req.params.id);
    let query = Model.findOne(param);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

  exports.getAll = (Model) =>  catchAsync(async (req, res,next) =>{
    let filter = {};
    if(req.params.userId) filter = { user: req.params.userId };
    //const docs = await Product.find();
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    //Send TO THE CLIENT
    res.status(200).json({
        // status:'success',
        // results: docs.length,
        data: {
            data: docs
        }
    });
});


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

  exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const param = getParam(req.params.id);
    const doc = await Model.findOneAndUpdate(param, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });