import QR from '../models/qrModel.js';

export const getUserQRCodes = async (req, res) => {
  try {
    const qrs = await QR.find({ userId: req.user._id });
    res.status(200).json(qrs);
  } catch (error) {
    console.error('Error getting QR codes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const saveQRCode = async (req, res) => {
  const { type, data, userId, qrImage, name } = req.body;
  if (!type || !data || !userId || !qrImage) {
    return res.status(400).json({ error: 'Data not found' });
  }
  const shortUrl = `https://localhost:3000/${Math.random().toString(36).substring(7)}`;
  console.log('Received type:', type); 
  console.log('Received data:', data); 
  console.log('Received userId:', userId); 
  console.log('Received qrImage:', qrImage); 
  console.log('Received name:', name); 
  console.log('Generated shortUrl:', shortUrl);
  const newQR = new QR({ 
    type, 
    data, 
    shortUrl, 
    userId, 
    qrImage, 
    name, 
    createdAt: new Date(),
    shortUrlOriginal: shortUrl, // Lưu URL gốc
    isActive: true,
    scanCount: 0,
  }); 

  try {
    await newQR.save();
    res.status(200).json({ shortUrl });
  } catch (error) {
    console.error('Error saving QR code:', error);
    res.status(500).json({ error: 'Failed to save QR code' });
  }
};



export const deleteQRCode = async (req, res) => {
  const { id } = req.params;

  try {
    const qrCode = await QR.findByIdAndDelete(id);
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }
    res.status(200).json({ message: 'QR code deleted successfully' });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    res.status(500).json({ error: 'Failed to delete QR code' });
  }
};


export const toggleQRCodeStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const qrCode = await QR.findById(id);
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    if (qrCode.isActive) {
      qrCode.isActive = false;
      qrCode.shortUrl = 'https://76e4-2001-ee0-500e-c150-992-a9a1-edc-d09b.ngrok-free.app/qr-disabled'; // Đổi shortUrl thành giá trị tạm thời
    } else {
      qrCode.isActive = true;
      qrCode.shortUrl = qrCode.shortUrlOriginal; // Khôi phục lại URL gốc
    }

    await qrCode.save();
    res.status(200).json({ message: 'QR code status updated successfully', isActive: qrCode.isActive });
  } catch (error) {
    console.error('Error updating QR code status:', error);
    res.status(500).json({ error: 'Failed to update QR code status' });
  }
};


export const checkQRCode = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const qrCode = await QR.findOne({ shortUrl });
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    if (!qrCode.isActive) {
      return res.status(403).json({ error: 'QR code is inactive' });
    }

    // Xử lý mã QR hoạt động
    res.status(200).json({ message: 'QR code is active', data: qrCode.data });
  } catch (error) {
    console.error('Error checking QR code:', error);
    res.status(500).json({ error: 'Failed to check QR code' });
  }
};

export const increaseScanCount = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const qrCode = await QR.findOne({ shortUrl });
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    qrCode.scanCount += 1;
    await qrCode.save();

    res.status(200).json({ message: 'QR code scan count updated successfully', scanCount: qrCode.scanCount });
  } catch (error) {
    console.error('Error updating QR code scan count:', error);
    res.status(500).json({ error: 'Failed to update QR code scan count' });
  }
};

export const checkAndIncreaseScanCount = async (req, res) => {
  const { shortUrl } = req.params;

  try {
    const qrCode = await QR.findOne({ shortUrl });
    if (!qrCode) {
      return res.status(404).json({ error: 'QR code not found' });
    }

    // Kiểm tra trạng thái hoạt động của mã QR
    if (!qrCode.isActive) {
      return res.status(403).json({ error: 'QR code is inactive' });
    }

    // Tăng số lần quét
    qrCode.scanCount += 1;
    await qrCode.save();

    res.status(200).json({ message: 'QR code is active and scan count updated', data: qrCode.data, scanCount: qrCode.scanCount });
  } catch (error) {
    console.error('Error checking and updating scan count:', error);
    res.status(500).json({ error: 'Failed to check and update scan count' });
  }
};





