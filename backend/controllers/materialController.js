const Material = require('../models/Material');
const ActivityLog = require('../models/ActivityLog');
const path = require('path');
const fs = require('fs');

const log = async (userId, action, details, req) => {
  try {
    await ActivityLog.create({ user: userId, action, category: 'system', details, ipAddress: req.ip });
  } catch {}
};

// Detect file type from MIME
const detectFileType = (mime) => {
  if (mime.includes('pdf'))                        return 'pdf';
  if (mime.includes('word') || mime.includes('document')) return 'doc';
  if (mime.includes('presentation') || mime.includes('powerpoint')) return 'ppt';
  if (mime.includes('spreadsheet') || mime.includes('excel')) return 'spreadsheet';
  if (mime.startsWith('image/'))                   return 'image';
  if (mime.startsWith('video/'))                   return 'video';
  return 'other';
};

// @route  GET /api/materials
exports.getMaterials = async (req, res) => {
  try {
    const { search, subject, fileType, status, week, tag, page = 1, limit = 12, uploadedBy } = req.query;
    const query = {};

    // Role-based visibility
    if (req.user.role === 'student') {
      query.status = 'approved';
    } else if (req.user.role === 'teacher') {
      // Teachers see approved + their own pending
      if (status) query.status = status;
      else query.$or = [{ status: 'approved' }, { status: 'pending', uploadedBy: req.user._id }];
    } else {
      // Admin sees everything
      if (status) query.status = status;
    }

    if (search) {
      query.$or = [
        ...(query.$or || []),
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { module: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (fileType) query.fileType = fileType;
    if (week) query.week = Number(week);
    if (tag) query.tags = tag.toLowerCase();
    if (uploadedBy) query.uploadedBy = uploadedBy;

    const total = await Material.countDocuments(query);
    const materials = await Material.find(query)
      .populate('uploadedBy', 'name email role')
      .populate('approvedBy', 'name')
      .populate('archivedBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, materials, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/materials/stats
exports.getStats = async (req, res) => {
  try {
    const [total, pending, approved, archived, byType] = await Promise.all([
      Material.countDocuments(),
      Material.countDocuments({ status: 'pending' }),
      Material.countDocuments({ status: 'approved' }),
      Material.countDocuments({ status: 'archived' }),
      Material.aggregate([{ $group: { _id: '$fileType', count: { $sum: 1 } } }]),
    ]);
    const totalDownloads = await Material.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]);
    res.json({
      success: true,
      stats: {
        total, pending, approved, archived,
        totalDownloads: totalDownloads[0]?.total || 0,
        byType,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/materials/:id
exports.getMaterial = async (req, res) => {
  try {
    const m = await Material.findById(req.params.id)
      .populate('uploadedBy', 'name email role')
      .populate('approvedBy', 'name email')
      .populate('targetGroup', 'name subject')
      .populate('replacesVersion', 'title version');
    if (!m) return res.status(404).json({ success: false, message: 'Material not found' });
    if (req.user.role === 'student' && m.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'This material is not yet available' });
    }
    res.json({ success: true, material: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  POST /api/materials  (multipart/form-data)
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const { title, description, subject, module: mod, week, academicYear, tags, version, replacesVersion } = req.body;
    const fileType = detectFileType(req.file.mimetype);
    const fileUrl = `/uploads/materials/${req.file.filename}`;

    // Auto-approve if admin
    const status = req.user.role === 'admin' ? 'approved' : 'pending';

    const material = await Material.create({
      title, description, subject,
      module: mod || '',
      week: week ? Number(week) : null,
      academicYear: academicYear || new Date().getFullYear().toString(),
      tags: tags ? tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
      version: version || '1.0',
      replacesVersion: replacesVersion || null,
      fileName: req.file.originalname,
      fileKey: req.file.filename,
      fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileType,
      uploadedBy: req.user._id,
      status,
      approvedBy: req.user.role === 'admin' ? req.user._id : null,
      approvedAt: req.user.role === 'admin' ? new Date() : null,
    });

    await material.populate('uploadedBy', 'name email role');
    await log(req.user._id, 'UPLOAD_MATERIAL', `Uploaded: "${title}" (${subject})`, req);

    // If this replaces a previous version, archive the old one
    if (replacesVersion) {
      await Material.findByIdAndUpdate(replacesVersion, {
        status: 'archived',
        archivedBy: req.user._id,
        archivedAt: new Date(),
        archivedReason: `Replaced by newer version: ${title} v${version}`,
      });
    }

    res.status(201).json({ success: true, material });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/materials/:id
exports.updateMaterial = async (req, res) => {
  try {
    const { tags, ...rest } = req.body;
    const update = { ...rest };
    if (tags) update.tags = tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const m = await Material.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('uploadedBy', 'name email role');
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, material: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/materials/:id/approve
exports.approveMaterial = async (req, res) => {
  try {
    const m = await Material.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    ).populate('uploadedBy', 'name email');
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    await log(req.user._id, 'APPROVE_MATERIAL', `Approved: "${m.title}"`, req);
    res.json({ success: true, material: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/materials/:id/archive
exports.archiveMaterial = async (req, res) => {
  try {
    const { reason } = req.body;
    const m = await Material.findByIdAndUpdate(
      req.params.id,
      { status: 'archived', archivedBy: req.user._id, archivedAt: new Date(), archivedReason: reason || '' },
      { new: true }
    ).populate('uploadedBy', 'name email');
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    await log(req.user._id, 'ARCHIVE_MATERIAL', `Archived: "${m.title}" — ${reason}`, req);
    res.json({ success: true, material: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  PUT /api/materials/:id/restore
exports.restoreMaterial = async (req, res) => {
  try {
    const m = await Material.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', archivedBy: null, archivedAt: null, archivedReason: '' },
      { new: true }
    );
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    await log(req.user._id, 'RESTORE_MATERIAL', `Restored: "${m.title}"`, req);
    res.json({ success: true, material: m });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  GET /api/materials/:id/download
exports.downloadMaterial = async (req, res) => {
  try {
    const m = await Material.findById(req.params.id);
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    if (req.user.role === 'student' && m.status !== 'approved') {
      return res.status(403).json({ success: false, message: 'Not available' });
    }
    const filePath = path.join(__dirname, '..', 'uploads', 'materials', m.fileKey);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }
    await Material.findByIdAndUpdate(req.params.id, { $inc: { downloadCount: 1 } });
    await log(req.user._id, 'DOWNLOAD_MATERIAL', `Downloaded: "${m.title}"`, req);
    res.setHeader('Content-Disposition', `attachment; filename="${m.fileName}"`);
    res.setHeader('Content-Type', m.mimeType);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route  DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
  try {
    const m = await Material.findById(req.params.id);
    if (!m) return res.status(404).json({ success: false, message: 'Not found' });
    // Delete physical file
    const filePath = path.join(__dirname, '..', 'uploads', 'materials', m.fileKey);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Material.findByIdAndDelete(req.params.id);
    await log(req.user._id, 'DELETE_MATERIAL', `Deleted: "${m.title}"`, req);
    res.json({ success: true, message: 'Material deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
