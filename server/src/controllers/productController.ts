import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";


// Get all products (public)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get products by current user (private)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const products = await queries.getProductsByUserId(userId);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching user's products:", error);
    res.status(500).json({ message: "Failed to fetch user's products" });
  }
};

// Get product by id (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id} = req.params;
    const product = await queries.getProductById(String(id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// Create a new product (private)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description, imageUrl } = req.body;
    if (!title || !description || !imageUrl) {
      return res.status(400).json({ message: "Title, description, and imageUrl are required" });
    }
    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Failed to create product" });
  } 
};

// Update a product (private)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { title, description, imageUrl } = req.body;

    const existingProduct = await queries.getProductById(String(id));
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (existingProduct.userId !== userId) {
      return res.status(403).json({ message: "You can only update your own products" });
    } 

    const product = await queries.updateProduct(String(id), {
      title,
      description,
      imageUrl,
    });
    res.status(200).json(product);

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

//Delete a product (private)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const existingProduct = await queries.getProductById(String(id));
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (existingProduct.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await queries.deleteProduct(String(id));
    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }
};