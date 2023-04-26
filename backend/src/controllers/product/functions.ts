import { Request, Response } from "express";
import { execute } from "../../db/mysql.connector";
import { ProductQueries } from "./queries";
import { IProductType } from "src/models/product.models";
import { ApiResponse } from "../../../types";




export const getProducts = async (_req: Request, res: Response) => {
    try {
        const products = await execute<IProductType[]>(ProductQueries.GetProducts, []);
        const response: ApiResponse<IProductType[]> = {
            data: {
                value: products,
            },
            statusCode: 200,
            statusMessage: "Products fetched successfully"
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const pageNo: number = Number(req.params.pageNo) || 1;
        const maxResultsOnPage = 5;
        const lowerBound = (pageNo - 1) * maxResultsOnPage;
        const upperBound = pageNo * maxResultsOnPage;
        const products = await execute<[IProductType[], any]>(ProductQueries.GetProduct, [lowerBound, upperBound])
        const infoBody = {
            length: products[0].length,
            currentPage: pageNo,
            nextPage: pageNo + 1,
            isLastPage: products[0].length < maxResultsOnPage
        }
        const response: ApiResponse<IProductType[]> = {
            data: {
                value: products[0],
                others: infoBody
            },
            statusCode: 200,
            statusMessage: "Products returned successfully"
        }
        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
}

export const addProduct = async (req: Request, res: Response) => {
    try {
        const body: IProductType = req.body;
        const { product_id, product_description, category, quantity, price, product_name, supplier_id } = body;
        const response = await execute<IProductType>(
            ProductQueries.InsertProduct,
            [product_id, product_description, category, quantity, price, product_name, supplier_id]
        )
        if (response)
            return res.status(200).json(response);
        else
            return res.status(400).json({ message: "Product not added" });
    } catch (error) {
        return res.status(404).json({ error: error })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const body: IProductType = req.body;
        const { product_id, product_description, category, quantity, price, product_name, supplier_id } = body;
        const response = await execute<IProductType>(
            ProductQueries.UpdateProduct,
            [product_id, product_description, category, quantity, price, product_name, supplier_id]
        )
        if (response)
            return res.status(200).json(response);
        else
            return res.status(400).json({ message: "Customer not updated" });
    } catch (error) {
        return res.status(404).json({ error: error })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const product_id = Number(req.params.product_id);
        const response = await execute<any>(ProductQueries.DeleteProduct, [product_id])
        if (response)
            return res.status(200).json({ message: "Customer deleted successfully" });
        else
            return res.status(400).json({ message: "Customer not deleted" });
    } catch (error) {
        return res.status(404).json({ error: error })
    }
}