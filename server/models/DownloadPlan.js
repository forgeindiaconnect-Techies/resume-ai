const mongoose = require("mongoose");


const downloadPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },


    key: {
      type: String,
      required: true,
      unique: true,
    },


    price: {
      type: Number,
      required: true,
    },


    watermarkRemoval: {
      type: Boolean,
      default: false,
    },


    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("DownloadPlan", downloadPlanSchema);
