import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { TiUpload } from "react-icons/ti";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  border: "none",
  outline: "none",
};

const ClothesModal = ({ open, setOpen }) => {
  const [formData, setFormData] = useState({
    item_code: "",
    category_id: "",
    style_id: "",
    year: "",
    season_id: "",
    price: "",
    color_id: "",
    img_url: "",
    s3_path: "",
  });

  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [colors, setColors] = useState([]);
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (formData.img_url) {
        URL.revokeObjectURL(formData.img_url);
      }
    };
  }, [formData.img_url]);

  useEffect(() => {
    console.log(open);
    if (!open) return;

    const fetchOptions = async () => {
      try {
        const [categoryRes, styleRes, seasonRes, colorRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_API}/fashion/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_API}/fashion/styles`),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_API}/fashion/seasons`),
          axios.get("https://backend-1s2t.onrender.com/api/fashion/colors"),
        ]);

        setCategories(categoryRes.data);
        setStyles(styleRes.data);
        setSeasons(seasonRes.data);
        setColors(colorRes.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setImage(uploadedImage);
      setIsUploading(true);

      try {
        const uploadData = new FormData();
        uploadData.append("file", uploadedImage);
        uploadData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadData,
          }
        );

        const data = await response.json();
        console.log("Cloudinary response:", data);

        setFormData((prevState) => ({
          ...prevState,
          img_url: data.secure_url,
          s3_path: data.secure_url,
        }));
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
      } finally {
        setIsUploading(false);
        e.target.value = null;
      }
    }
  };

  const handleColorSelect = (colorId) => {
    setFormData((prevState) => ({
      ...prevState,
      color_id: colorId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login");
      return;
    }

    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        user_id: session.user.id,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API}/fashion/clothes`,
        payload
      );
      console.log("Product upload response:", response);
      alert("Product uploaded successfully!");
      setOpen(false);
    } catch (error) {
      console.log("Error uploading product:", error);
      alert("Failed to upload product.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.1)" },
      }}
    >
      <Box sx={{ ...modalStyle }}>
        <form onSubmit={handleSubmit}>
          <div className="modal-body flex flex-col md:flex-row gap-6">
            {/* Image Upload Section */}
            <div className="w-[80%] mx-auto">
              <div className="image-upload bg-[#ffe6cc] border-2 border-[#ff733b] rounded-lg w-full md:w-[80%] lg:w-[90%] h-72 flex items-center justify-center text-center py-4 gap-2">
                <div className="text-center w-full h-full flex flex-col">
                  <div className="my-auto max-h-[90%] flex justify-center items-center">
                    {formData.img_url ? (
                      <img
                        src={formData.img_url}
                        alt="Uploaded Preview"
                        className="max-w-[90%] max-h-[90%] object-contain rounded-md"
                      />
                    ) : (
                      <div className="items-center">
                        <TiUpload className="text-orange-500 w-[40px] h-[40px]" />
                        <p className="text-[#ff733b] font-bold mt-0">
                          Image Upload
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={isUploading}
                  />
                  {isUploading ? (
                    <p>Uploading...</p>
                  ) : (
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer text-purple-800 text-lg font-bold opacity-50 mt-auto"
                    >
                      Click to Upload
                    </label>
                  )}
                </div>
              </div>

              {/* Image Preview Section */}
              {/* <div className="mt-4 w-full flex justify-center">
                {formData.img_url && (
                  <img
                    src={formData.img_url}
                    alt="Uploaded Preview"
                    className="w-64 object-cover rounded-md"
                  />
                )}
              </div> */}
            </div>

            {/* Form Section */}
            <div className="form-section w-full md:w-1/2 space-y-6">
              <div className="flex items-center gap-2">
                <label className="w-1/3 font-bold text-black">Item Code</label>
                <TextField
                  variant="outlined"
                  size="small"
                  name="item_code"
                  value={formData.item_code}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="category"
                  className="w-1/3 font-bold text-black"
                >
                  Category
                </label>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    id="category"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    label="Category"
                    className="w-full"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.category_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Style Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="style" className="w-1/3 font-bold text-black">
                  Style
                </label>
                <FormControl fullWidth size="small">
                  <InputLabel>Style</InputLabel>
                  <Select
                    id="style"
                    name="style_id"
                    value={formData.style_id}
                    onChange={handleChange}
                    label="Style"
                    className="w-full"
                  >
                    {styles.map((style) => (
                      <MenuItem key={style._id} value={style._id}>
                        {style.style_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Season Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="season" className="w-1/3 font-bold text-black">
                  Season
                </label>
                <FormControl fullWidth size="small">
                  <InputLabel>Season</InputLabel>
                  <Select
                    id="season"
                    name="season_id"
                    value={formData.season_id}
                    onChange={handleChange}
                    label="Season"
                    className="w-full"
                  >
                    {seasons.map((season) => (
                      <MenuItem key={season._id} value={season._id}>
                        {season.season_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              {/* Year and Price Fields */}
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2 gap-2">
                  <label htmlFor="year" className="font-bold text-black">
                    Year
                  </label>
                  <FormControl fullWidth size="small">
                    <InputLabel>Year</InputLabel>
                    <Select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="w-full"
                    >
                      {["2024", "2023", "2022", "2021"].map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div className="flex flex-col w-1/2 gap-2">
                  <label htmlFor="price" className="font-bold text-black">
                    Price
                  </label>
                  <TextField
                    type="number"
                    variant="outlined"
                    size="small"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-black">Color</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <div
                      key={color._id}
                      className="text-center cursor-pointer"
                      onClick={() => handleColorSelect(color._id)} // Handle color selection
                    >
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{
                          backgroundColor: color.hexadecimal_value,
                        }}
                      ></div>
                      <p className="text-xs mt-1">{color.color_name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="contained"
                className="bg-[#ff733b] w-full outline text-white rounded-full mt-6 py-2"
                type="submit"
              >
                Upload
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default ClothesModal;
