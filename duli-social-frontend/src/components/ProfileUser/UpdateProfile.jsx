import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Avatar, Fade, Backdrop, CircularProgress, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { updateProfileAction } from '../../Redux/Auth/auth.action';
import CloseButton from '@mui/icons-material/CloseRounded';
import { cloudUpload } from '../../utils/cloudUpload';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  bgcolor: '#eaf2ef'
};

export default function UpdateProfile({ open, handleClose }) {
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // 1. Cập nhật useEffect: Load thêm Bio cũ
  useEffect(() => {
    if (open && auth.user) {
      formik.setValues({
        firstName: auth.user.firstName || "",
        lastName: auth.user.lastName || "",
        gender: auth.user.gender || "male",
        bio: auth.user.bio || "" // <--- THÊM DÒNG NÀY
      });
      setImagePreview(auth.user.image || "");
      setSelectedImage(null);
    }
  }, [open, auth.user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  // 2. Cập nhật Formik: Thêm trường bio
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      gender: "",
      bio: "" // <--- THÊM DÒNG NÀY
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let imageUrl = auth.user.image;

        if (selectedImage) {
          imageUrl = await cloudUpload(selectedImage, "image");
        }

        const reqData = {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          bio: values.bio, // <--- THÊM DÒNG NÀY
          image: imageUrl
        };

        await dispatch(updateProfileAction(reqData));
        handleClose();
      } catch (error) {
        console.log("error updating profile", error);
      } finally {
        setLoading(false);
      }
    }
  })

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{backdropFilter: 'blur(2px)'}}
    >
      <Fade in={open}>

      <Box sx={style} component="form" onSubmit={formik.handleSubmit}>
        <div className='flex items-center justify-between w-full'>
          <Typography variant="h6" component="h2" sx={{fontWeight: 700}}>
            Edit Profile
          </Typography>
          <IconButton onClick={handleClose} 
                    sx={{color: '#912f56', transition: 'all 0.2s ease'}}>
            <CloseButton />
          </IconButton>
        </div>

        <div className='flex justify-center mb-8'>
               <div className="relative group">
                  <Avatar
                    sx={{ width: 120, height: 120, border: '1px solid #e0e0e0' }}
                    src={imagePreview || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  />
                  
                  <label htmlFor="upload-avatar" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                      <PhotoCamera sx={{ color: 'white', fontSize: 40 }} />
                  </label>
                  
                  <input accept="image/*" id="upload-avatar" 
                    type="file" hidden onChange={handleImageChange}
                  />
               </div>
          </div>

        <div className='space-y-5'>
            <div className='flex gap-5'>
                <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                />
                <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                />
            </div>
            
            {/* 3. Thêm TextField cho BIO */}
            <TextField
                fullWidth
                id="bio"
                name="bio"
                label="Bio"
                multiline
                rows={3} // Cho phép nhập nhiều dòng
                value={formik.values.bio}
                onChange={formik.handleChange}
                placeholder="Write something about yourself..."
            />

            <FormControl>
                <FormLabel id="gender-group-label">Gender</FormLabel>
                <RadioGroup
                    row
                    aria-labelledby="gender-group-label"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                </RadioGroup>
            </FormControl>
          </div>

        <Button
            type='submit'
            variant="contained"
            fullWidth
            sx={{ mt: 4, bgcolor: '#912f56', '&:hover': { bgcolor: '#7a2245' }, py: 1.5, borderRadius: '20px' }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute', borderRadius: '12px' }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
      </Box>
      </Fade>
    </Modal>
  );
}