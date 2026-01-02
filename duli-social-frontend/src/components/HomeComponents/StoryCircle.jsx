import React from 'react'
import { Avatar } from '@mui/material'

const StoryCircle = ({ user }) => {
  return (
    <div className='flex flex-col items-center cursor-pointer min-w-[80px]'> 
      
      {/* 1. VÒNG TRÒN VIỀN NGOÀI (Gradient màu tím/hồng đặc trưng) */}
      <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[3px]">
          
          {/* 2. VÒNG TRÒN TRẮNG ĐỆM (Tạo khoảng cách giữa ảnh và viền màu) */}
          <div className="bg-white rounded-full p-[2px] w-full h-full flex items-center justify-center">
              
              {/* 3. AVATAR CHÍNH (Nằm gọn bên trong) */}
              <Avatar 
                  sx={{ width: '100%', height: '100%' }} // Chiếm hết khổ div cha
                  src={user?.image || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={user?.firstName}
              />
          </div>
      </div>
      
      {/* Tên User */}
      <p className='text-xs font-medium opacity-90 mt-1 w-20 truncate text-center'>
          {user?.firstName ? (user.firstName + " " + user.lastName) : "User"}
      </p>
    </div>
  )
}

export default StoryCircle