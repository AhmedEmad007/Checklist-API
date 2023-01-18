const { ObjectId } = require("mongoose");
const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema(
  {
    checklistName: {
      type: String,
    },
    checks: [
      {
        title: { type: String },
        description: { type: String },
        ckecked: { type: Boolean, default: false },
      },
    ],
    own: {
      type: Boolean,
    },
    assignee: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    ],
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checklist", checklistSchema);
