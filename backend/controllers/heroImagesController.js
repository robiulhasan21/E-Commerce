import { v2 as cloudinary } from "cloudinary";
import heroImagesModel from "../models/heroImagesModel.js";

/* =========================
   GET HERO IMAGES
========================= */
const getHeroImages = async (req, res) => {
  try {
    let heroImages = await heroImagesModel.findOne({});

    if (!heroImages) {
      heroImages = new heroImagesModel({});
      await heroImages.save();
    }

    res.json({
      success: true,
      images: {
        hero_images: heroImages.hero_images || [],
        subhero_img1: heroImages.subhero_img1 || null,
        subhero_img2: heroImages.subhero_img2 || null,
        subhero_img3: heroImages.subhero_img3 || null,
        subhero_img4: heroImages.subhero_img4 || null,
        latestcollection_video: heroImages.latestcollection_video || null,
        bestsellers_video: heroImages.bestsellers_video || null,
      },
    });
  } catch (error) {
    console.log("Error fetching hero images:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================
   ADD HERO / SUBHERO / VIDEO
========================= */
const addHeroImages = async (req, res) => {
  try {
    let heroImages = await heroImagesModel.findOne({});
    if (!heroImages) heroImages = new heroImagesModel({});

    const uploadedUrls = [];

    // Hero images (multiple)
    if (req.files && Array.isArray(req.files)) {
      const heroFiles = req.files.filter(
        (file) =>
          file.fieldname.startsWith("hero_image") ||
          file.fieldname === "hero_images"
      );

      for (const file of heroFiles) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
          folder: "hero-images",
        });
        uploadedUrls.push(result.secure_url);
      }
    }

    if (uploadedUrls.length > 0) {
      heroImages.hero_images = [
        ...(heroImages.hero_images || []),
        ...uploadedUrls,
      ];
    }

    // Subhero images
    const subheroFields = [
      "subhero_img1",
      "subhero_img2",
      "subhero_img3",
      "subhero_img4",
    ];

    for (const field of subheroFields) {
      const fileObj = req.files?.find((f) => f.fieldname === field);
      if (fileObj) {
        const result = await cloudinary.uploader.upload(fileObj.path, {
          resource_type: "image",
          folder: "hero-images",
        });
        heroImages[field] = result.secure_url;
      }
    }

    // Videos
    const latestFile = req.files?.find(
      (f) => f.fieldname === "latestcollection_video"
    );
    if (latestFile) {
      const result = await cloudinary.uploader.upload(latestFile.path, {
        resource_type: "video",
        folder: "hero-videos",
      });
      heroImages.latestcollection_video = result.secure_url;
    }

    const bestFile = req.files?.find(
      (f) => f.fieldname === "bestsellers_video"
    );
    if (bestFile) {
      const result = await cloudinary.uploader.upload(bestFile.path, {
        resource_type: "video",
        folder: "hero-videos",
      });
      heroImages.bestsellers_video = result.secure_url;
    }

    heroImages.updatedAt = Date.now();
    await heroImages.save();

    res.json({
      success: true,
      message: "Hero content added successfully",
      images: heroImages,
    });
  } catch (error) {
    console.log("Error adding hero images:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE HERO IMAGE (by index)
========================= */
const deleteHeroImage = async (req, res) => {
  try {
    const { index } = req.body;

    let heroImages = await heroImagesModel.findOne({});
    if (!heroImages || !heroImages.hero_images?.length) {
      return res.json({ success: false, message: "No hero images found" });
    }

    if (index < 0 || index >= heroImages.hero_images.length) {
      return res.json({ success: false, message: "Invalid index" });
    }

    heroImages.hero_images.splice(index, 1);
    heroImages.updatedAt = Date.now();
    await heroImages.save();

    res.json({
      success: true,
      message: "Hero image deleted",
      images: heroImages,
    });
  } catch (error) {
    console.log("Error deleting hero image:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================
   REORDER HERO IMAGES
========================= */
const reorderHeroImages = async (req, res) => {
  try {
    const { fromIndex, toIndex } = req.body;

    let heroImages = await heroImagesModel.findOne({});
    if (!heroImages || !heroImages.hero_images?.length) {
      return res.json({ success: false, message: "No hero images found" });
    }

    const [moved] = heroImages.hero_images.splice(fromIndex, 1);
    heroImages.hero_images.splice(toIndex, 0, moved);

    heroImages.updatedAt = Date.now();
    await heroImages.save();

    res.json({
      success: true,
      message: "Hero images reordered",
      images: heroImages,
    });
  } catch (error) {
    console.log("Error reordering hero images:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE SUBHERO IMAGE
========================= */
const deleteSubheroImage = async (req, res) => {
  try {
    const { field } = req.body;
    const allowed = [
      "subhero_img1",
      "subhero_img2",
      "subhero_img3",
      "subhero_img4",
    ];

    if (!allowed.includes(field)) {
      return res.json({ success: false, message: "Invalid field" });
    }

    let heroImages = await heroImagesModel.findOne({});
    if (!heroImages) heroImages = new heroImagesModel({});

    heroImages[field] = "";
    heroImages.updatedAt = Date.now();
    await heroImages.save();

    res.json({
      success: true,
      message: `${field} deleted`,
      images: heroImages,
    });
  } catch (error) {
    console.log("Error deleting subhero image:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================
   DELETE HERO VIDEO
========================= */
const deleteHeroVideo = async (req, res) => {
  try {
    const { field } = req.body;
    const allowed = ["latestcollection_video", "bestsellers_video"];

    if (!allowed.includes(field)) {
      return res.json({ success: false, message: "Invalid field" });
    }

    let heroImages = await heroImagesModel.findOne({});
    if (!heroImages) heroImages = new heroImagesModel({});

    heroImages[field] = "";
    heroImages.updatedAt = Date.now();
    await heroImages.save();

    res.json({
      success: true,
      message: `${field} deleted`,
      images: heroImages,
    });
  } catch (error) {
    console.log("Error deleting hero video:", error);
    res.json({ success: false, message: error.message });
  }
};

/* =========================
   EXPORTS (ONLY ONCE)
========================= */
export {
  getHeroImages,
  addHeroImages,
  deleteHeroImage,
  reorderHeroImages,
  deleteSubheroImage,
  deleteHeroVideo,
};
