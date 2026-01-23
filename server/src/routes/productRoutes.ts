import { Router } from "express";
import * as productController from "../controllers/productController";
import { requireAuth } from "@clerk/express";

const router = Router();

// GET /api/products => get all products (public)
router.get("/", productController.getAllProducts);

// GET /api/products/my => get products by current user (private)
router.get("/my", requireAuth(), productController.getMyProducts);

// GET /api/products/:id => get product by id (public)
router.get("/:id", productController.getProductById);

// POST /api/products => create a new product (private)
router.post("/", requireAuth(), productController.createProduct);

// PUT /api/products/:id => update a product (private - owner only)
router.put("/:id", requireAuth(), productController.updateProduct);

// DELETE /api/products/:id => delete a product (private - owner only)
router.delete("/:id", requireAuth(), productController.deleteProduct);


export default router;