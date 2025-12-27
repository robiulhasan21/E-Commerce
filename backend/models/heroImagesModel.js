import mongoose from "mongoose";

const heroImagesSchema = new mongoose.Schema({
  hero_images: { type: [String], default: [] }, // Array to store unlimited hero images
  subhero_img1: { type: String, default: "" },
  subhero_img2: { type: String, default: "" },
  subhero_img3: { type: String, default: "" },
  subhero_img4: { type: String, default: "" },
  // Video fields for frontend hero sections
  latestcollection_video: { type: String, default: "" },
  bestsellers_video: { type: String, default: "" },
  updatedAt: { type: Number, default: Date.now },
});

const heroImagesModel = mongoose.models.heroimages || mongoose.model("heroimages", heroImagesSchema);
export default heroImagesModel;

