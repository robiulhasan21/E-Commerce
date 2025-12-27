import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Add product (existing)
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, type, sizes, bestseller, quantity } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(item => item !== undefined);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      type,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      quantity: Number(quantity) || 0,
      images: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update product (New)
const updateProduct = async (req, res) => {
  try {
    const { id, name, description, price, category, type, sizes, bestseller, quantity } = req.body;

    const product = await productModel.findById(id);
    if(!product) return res.json({ success: false, message: "Product not found" });

    // Update basic fields
    product.name = name;
    product.description = description;
    product.price = Number(price);
    product.category = category;
    product.type = type;
    product.sizes = JSON.parse(sizes);
    product.quantity = Number(quantity) || 0;
    product.bestseller = bestseller === "true";

    // Update images if new ones uploaded
    if(req.files){
      const newImages = [];
      for(let i=0;i<4;i++){
        const img = req.files[`image${i+1}`] && req.files[`image${i+1}`][0];
        if(img){
          const result = await cloudinary.uploader.upload(img.path, { resource_type: "image" });
          newImages.push(result.secure_url);
        } else if(product.images[i]){
          newImages.push(product.images[i]); // keep existing
        }
      }
      product.images = newImages;
    }

    await product.save();
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// Other endpoints
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct };
