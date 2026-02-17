import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: String,
  idType: { type: String, enum: ['Passport', 'NIN', 'SSN', "Driver's License"], required: true },
  documentUrl: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }
});

const Kyc = mongoose.models.Kyc || mongoose.model('Kyc', kycSchema);
export default Kyc;
