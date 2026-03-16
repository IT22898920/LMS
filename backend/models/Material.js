const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    subject: { type: String, required: true, trim: true },
    module: { type: String, default: '' },       // e.g. "Week 3 — Lecture Slides"
    week: { type: Number, default: null },
    academicYear: { type: String, default: '' },

    // File info
    fileName: { type: String, required: true },   // original filename
    fileKey: { type: String, required: true },     // stored filename (unique)
    fileUrl: { type: String, required: true },     // accessible URL
    fileSize: { type: Number, default: 0 },        // bytes
    mimeType: { type: String, default: '' },
    fileType: {
      type: String,
      enum: ['pdf', 'doc', 'ppt', 'image', 'video', 'spreadsheet', 'other'],
      default: 'other',
    },

    // Taxonomy
    tags: [{ type: String, lowercase: true, trim: true }],
    targetGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningGroup',
      default: null,
    },

    // Ownership & moderation
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'archived'],
      default: 'pending',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      approvedAt: { type: Date, default: null },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      archivedAt: { type: Date, default: null },
    archivedReason: { type: String, default: '' },

    // Versioning — link to the material this replaces
    replacesVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Material',
      default: null,
    },
    version: { type: String, default: '1.0' },

    // Engagement
    downloadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

materialSchema.index({ subject: 1, status: 1 });
materialSchema.index({ tags: 1 });
materialSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Material', materialSchema);
