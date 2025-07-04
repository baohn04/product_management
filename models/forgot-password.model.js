const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
  { 
    email: String,
    otp: String,
    expireAt: { 
      type: Date,  
      expires: 180 // Giá trị truyền vào cộng thêm 180s sẽ xóa bản ghi
    }
  },
  {
    timestamps: true
  }
);

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;