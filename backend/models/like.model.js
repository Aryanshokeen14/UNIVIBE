import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Prevent duplicate likes (1 user, 1 post max)
LikeSchema.index({ user: 1, post: 1 }, { unique: true });

const Like = mongoose.model("Like", LikeSchema);
export default Like;
