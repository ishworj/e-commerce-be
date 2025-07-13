import FeatureBannerModel from "./featureBanner.schema.js"

export const createFeatureBanner = (obj) => {
    return new FeatureBannerModel(obj).save()
}

export const fetchFeatureBanner = () => {
    return FeatureBannerModel.find({})
}

export const deleteFeatureBanner = (id) => {
    return FeatureBannerModel.findByIdAndDelete(id)
}

export const updateFeatureBanner = (id, updateObj) => {
    return FeatureBannerModel.findOneAndUpdate({ _id: id }, updateObj, { new: true })
}