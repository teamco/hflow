export const cloudinaryConfig = {
  cloudName: process.env.cloudName,
  uploadPreset: process.env.uploadPreset
};

export const cloudinaryAPI = {
  signature: 'storage/signature',
  Widget_API: 'https://upload-widget.cloudinary.com/global/all.js',
  Base_delivery_URL: `http://res.cloudinary.com/${cloudinaryConfig.cloudName}`,
  Secure_delivery_URL: `https://res.cloudinary.com/${cloudinaryConfig.cloudName}`,
  API_base_URL: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}`,
  API_provisioning_URL: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}`,
  Image_upload_API: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
  Auto_upload_API: `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`
};
