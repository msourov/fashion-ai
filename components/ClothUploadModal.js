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

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  bgcolor: "background.paper",
  borderRadius: "20px",
  p: 4,
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

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [colors, setColors] = useState([]); // State to hold color data
  const { data: session } = useSession();
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const categoryResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API}/fashion/categories`
        );
        const styleResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API}/fashion/styles`
        );
        const seasonResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_API}/fashion/seasons`
        );
        const colorResponse = await axios.get(
          "https://backend-1s2t.onrender.com/api/fashion/colors"
        ); // Fetching colors from the API

        setCategories(categoryResponse.data);
        setStyles(styleResponse.data);
        setSeasons(seasonResponse.data);
        setColors(colorResponse.data); // Set color data from API
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    if (uploadedImage) {
      setImage(uploadedImage);
      setFormData((prevState) => ({
        ...prevState,
        img_url: URL.createObjectURL(uploadedImage),
        s3_path: `https://s3.amazonaws.com/your-bucket/${uploadedImage.name}`,
      }));
    }
  };

  const handleColorSelect = (colorId) => {
    setFormData((prevState) => ({
      ...prevState,
      color_id: colorId, // Set the selected color id
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_API}/fashion/clothes`,
        {
          item_code: formData.item_code,
          category_id: formData.category_id,
          style_id: formData.style_id,
          year: formData.year,
          season_id: formData.season_id,
          price: parseFloat(formData.price),
          color_id: formData.color_id,
          user_id: session.user.id,
          s3_path: "https://s3.amazonaws.com/your-bucket/cloth-image.jpg",
          img_url:
            "https://images.unsplash.com/photo-1529636273736-fc88b31ea9d9?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }
      );
      alert("Product uploaded successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error uploading product:", error);
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
            <div className="image-upload bg-[#ffe6cc] border-2 border-[#ff733b] rounded-lg w-full md:w-1/2 h-72 flex items-center justify-center text-center">
              <div className="text-center">
                <TiUpload className="text-orange-500 w-[40px] h-[40px]" />
                <p className="text-[#ff733b] font-bold mt-0">Image Upload</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer text-purple-800 text-lg font-bold opacity-50"
                >
                  Click to Upload
                </label>
              </div>
            </div>

            {/* Image Preview Section */}
            {/* <div className="mt-4 w-full md:w-1/2 flex justify-center">
              {formData.img_url && (
                <img
                  src={formData.img_url}
                  alt="Uploaded Preview"
                  className="w-32 h-32 object-cover rounded-md"
                />
              )}
            </div> */}

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
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 text-sm w-full"
                  >
                    <option value="" disabled>
                      Select Year
                    </option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
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
                        className="w-8 h-8 rounded-full"
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
