const Bootcamp = require('../models/Bootcamp')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const geocoder = require('../utils/geocoder')

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query

    //Create req query
    let reqQuery = { ...req.query }

    //Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']

    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach(params => delete reqQuery[params])

    console.log(reqQuery)

    //Create query string
    let queryStr = JSON.stringify(req.query)

    //Create operators ($gt, $gte etc)
    queryStr = queryStr.replace(/\b(gt|gte|le|lte|in)\b/g, match => `$${match}`)

    query = Bootcamp.find(JSON.parse(queryStr))

    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
        console.log(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    const bootcamps = await query

    res.status(200).json({success: true, count: bootcamps.length, data: bootcamps})
})

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id)

        if (!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404)
            )
        }

        res.status(200).json({success: true, data: bootcamp})
    
})

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.create(req.body)

        res.status(201).json({
            success: true,
            data: bootcamp
        })
    
})

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
    
        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404)
            )
        }
    
        res.status(200).json({success: true, data: bootcamp})
    
})

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    
        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with the id of ${req.params.id}`, 404)
            )
        }
    
        res.status(200).json({success: true, data: {}})

})

// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params

    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode)
    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //Calc radius using radius
    //Divide dist by radius of earth
    //Earth radius = 3963 mi / 6738 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    })

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})