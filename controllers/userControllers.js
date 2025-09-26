import { User } from "../models/User.js";
import { catchAsyncError } from "../utils/catchAsyncError.js";
import ErrorHandle from "../utils/errorHandle.js";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new ErrorHandle("User not found", 404));
  res.status(200).json({ success: true, user });
});

export const userDashboard = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    dashboard: {
      name: `${user.FirstName} ${user.LastName}`,
      email: user.Email,
      role: user.Role,
      joined: user.createdAt,
    },
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { FirstName, LastName, Contact, Email } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandle("User not found", 404));

  if (FirstName) user.FirstName = FirstName;
  if (LastName) user.LastName = LastName;
  if (Contact) user.Contact = Contact;
  if (Email) user.Email = Email;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return next(new ErrorHandle("Please provide old and new password", 400));
  }

  const user = await User.findById(req.user._id).select("+Password");
  if (!user) return next(new ErrorHandle("User not found", 404));

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandle("Incorrect old password", 401));

  user.Password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

export const uploadProfilePicture = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next(new ErrorHandle("No file uploaded", 400));

  const S3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const fileName = `profile-pictures/${req.user._id}-${Date.now()}.jpg`;

  await S3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    })
  );

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  const user = await User.findById(req.user._id);
  user.ProfilePicture = { url: fileUrl };
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    url: fileUrl,
  });
});

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  if (!req.file) return next(new ErrorHandle("No file uploaded", 400));

  const S3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandle("User not found", 404));

  // ✅ Delete old picture if it exists
  if (user.ProfilePicture?.url) {
    try {
      // Extract old key from URL
      const oldKey = user.ProfilePicture.url.split(".com/")[1];
      await S3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: oldKey,
        })
      );
      console.log("🗑️ Old profile picture deleted:", oldKey);
    } catch (err) {
      console.error("⚠️ Error deleting old profile picture:", err.message);
    }
  }

  // ✅ Upload new picture
  const fileKey = `profile-pictures/${user._id}-${Date.now()}.jpg`;
  await S3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    })
  );

  const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

  user.ProfilePicture = { url: fileUrl };
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    url: fileUrl,
  });
});
