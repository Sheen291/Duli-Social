import React, { useEffect, useState } from 'react';
import { 
  Box, Button, Typography, Modal, Avatar, Fade, Backdrop, 
  CircularProgress, IconButton, TextField, Radio, RadioGroup, 
  FormControlLabel, FormControl, FormLabel, useTheme 
} from '@mui/material'; 
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
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: 4,
  outline: 'none',
};

export default function UpdateProfile({ open, handleClose }) {
  const theme = useTheme(); 
  const dispatch = useDispatch();
  const { auth } = useSelector(store => store);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (open && auth.user) {
      formik.setValues({
        firstName: auth.user.firstName || "",
        lastName: auth.user.lastName || "",
        gender: auth.user.gender || "male",
        bio: auth.user.bio || ""
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

  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", gender: "", bio: "" },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let imageUrl = auth.user.image;
        if (selectedImage) {
          imageUrl = await cloudUpload(selectedImage, "image");
        }
        const reqData = { ...values, image: imageUrl };
        await dispatch(updateProfileAction(reqData));
        handleClose();
      } catch (error) {
        console.log("error updating profile", error);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(2px)' } } }}
    >
      <Fade in={open}>
        <Box sx={style} component="form" onSubmit={formik.handleSubmit}>
          {/* HEADER */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary">
              Edit Profile
            </Typography>
            <IconButton onClick={handleClose} sx={{ color: 'text.secondary' }}>
              <CloseButton />
            </IconButton>
          </Box>

          {/* AVATAR UPLOAD */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Box className="relative group">
              <Avatar
                sx={{ 
                  width: 110, height: 110, 
                  border: '2px solid', 
                  borderColor: 'divider' 
                }}
                src={imagePreview || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              />
              <label htmlFor="upload-avatar" className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-300">
                <PhotoCamera sx={{ color: 'white', fontSize: 32 }} />
              </label>
              <input accept="image/*" id="upload-avatar" type="file" hidden onChange={handleImageChange} />
            </Box>
          </Box>

          {/* FORM FIELDS */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth label="First Name" name="firstName"
                value={formik.values.firstName} onChange={formik.handleChange}
              />
              <TextField
                fullWidth label="Last Name" name="lastName"
                value={formik.values.lastName} onChange={formik.handleChange}
              />
            </Box>
            
            <TextField
              fullWidth multiline rows={3} label="Bio" name="bio"
              placeholder="Write something about yourself..."
              value={formik.values.bio} onChange={formik.handleChange}
            />

            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontSize: '0.85rem', mb: 0.5 }}>Gender</FormLabel>
              <RadioGroup
                row name="gender"
                value={formik.values.gender} onChange={formik.handleChange}
              >
                <FormControlLabel value="male" control={<Radio size="small" />} label={<Typography variant="body2">Male</Typography>} />
                <FormControlLabel value="female" control={<Radio size="small" />} label={<Typography variant="body2">Female</Typography>} />
                <FormControlLabel value="other" control={<Radio size="small" />} label={<Typography variant="body2">Other</Typography>} />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* SUBMIT BUTTON */}
          <Button
            type='submit' variant="contained" fullWidth
            sx={{ 
              mt: 4, bgcolor: '#912f56', borderRadius: '20px', py: 1.2, fontWeight: 600,
              '&:hover': { bgcolor: '#7a2245' } 
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
          </Button>

          {/* LOADING OVERLAY */}
          <Backdrop
            sx={{ color: '#fff', zIndex: 10, position: 'absolute', borderRadius: '12px' }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      </Fade>
    </Modal>
  );
}