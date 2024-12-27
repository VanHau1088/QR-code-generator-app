// models/qrModel.js
import mongoose from 'mongoose';

const qrSchema = new mongoose.Schema({
    type: { type: String, required: true },
    data: { type: Object, required: true },
    shortUrl: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Đảm bảo trường userId được định nghĩa
    qrImage: { type: String, required: true }, 
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Thêm trường createdAt
    isActive: { type: Boolean, default: true },
    shortUrlOriginal: { type: String, required: true }, // Lưu URL gốc
    scanCount: { type: Number, default: 0 } // Thêm trường scanCount
});

const QR = mongoose.model('QR', qrSchema);

export default QR;
