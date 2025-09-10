function responseHandler(req, res, next) {
    res.success = (data = null, message = 'Success', errorCode = 0) => {
        res.status(200).json({
            success: true,
            errorCode,
            message,
            data
        });
    };

    res.error = (message = 'Error', errorCode = 1, errors = null) => {
        res.status(500).json({
            success: false,
            errorCode,
            message,
            errors
        });
    };

    next();
}

module.exports = responseHandler;