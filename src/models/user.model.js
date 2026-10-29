import { model, Schema } from "mongoose";

const profileSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    birthDate: {
      type: Date,
    },
    phone: { type: String, trim: true },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: { values: ["user", "admin"], message: "Rol no permitido" },
      default: "user",
    },
    profile: { type: profileSchema, required: true },
    deleteAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("events", {
  ref: "Event",
  localField: "_id",
  foreignField: "organizer",
});
export const UserModel = model("User", userSchema);
