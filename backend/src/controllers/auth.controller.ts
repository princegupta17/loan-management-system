import { body, validationResult } from "express-validator";
import { USER_ROLES } from "../constants.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const publicUser = (user: any) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
  pan: user.pan,
  dob: user.dob,
  monthlySalary: user.monthlySalary,
  employmentMode: user.employmentMode,
  salarySlipPath: user.salarySlipPath,
  personalDetailsCompleted: user.personalDetailsCompleted,
  documentsUploaded: user.documentsUploaded,
});

export const signupValidators = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidators = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());

  const { fullName, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, "Email is already registered");

  const user = await User.create({
    fullName,
    email,
    password,
    role: USER_ROLES.BORROWER,
  });
  const token = generateToken({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: publicUser(user), token },
        "Signup successful",
      ),
    );
});

export const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    throw new ApiError(400, "Validation failed", errors.array());

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new ApiError(401, "Invalid email or password");

  const token = generateToken({
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: publicUser(user), token },
        "Login successful",
      ),
    );
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);
  if (!user) throw new ApiError(404, "User not found");
  res.status(200).json(new ApiResponse(200, { user: publicUser(user) }));
});
