export const getPaginatedData = async (model, req) => {
    const limit = 10;
    const page = parseInt(req.query.page) || 1

    const options = {
        page: page,
        limit: limit,
        sort: '-createdAt'
    }
    return await model.paginate({}, options)
}

export const getPaginatedDataFilter = async (model, req, filter) => {
    const limit = 10;
    const page = parseInt(req.query.page) || 1

    const options = {
        page: page,
        limit: limit,
        sort: '-createdAt'
    }
    return await model.paginate(filter, options)
}