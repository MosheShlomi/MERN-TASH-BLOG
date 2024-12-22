import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";

export const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;

        const newComment = new Category({
            name
        });

        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find().sort({ createdId: -1, });
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};


export const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);

        if (!category) {
            return next(errorHandler(404, "קטגוריה לא נמצאה"));
        }

        const editedCategory = await Category.findByIdAndUpdate(req.params.categoryId, {
            name: req.body.name
        }, { new: true });

        res.status(200).json(editedCategory);
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);

        if (!category) {
            return next(errorHandler(404, "קטגוריה לא נמצאה"));
        }

        await Category.findByIdAndDelete(req.params.categoryId);

        res.status(200).json("קטגוריה נמחקה בהצלחה!");
    } catch (error) {
        next(error);
    }
};


