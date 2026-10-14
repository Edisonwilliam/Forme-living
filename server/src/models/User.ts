import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// ── Subdocuments ──────────────────────────────────────────────────────────────
export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber: string;
  isDefault: boolean;
}

const AddressSchema = new Schema<IAddress>(
  {
    fullName: { type: String, required: true, trim: true },
    streetAddress: { type: String, required: true, trim: true },
    apartment: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'Nigeria' },
    postalCode: { type: String, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

// ── Main Document ─────────────────────────────────────────────────────────────
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'customer' | 'admin';
  googleId?: string;
  authProvider: 'local' | 'google' | 'both';
  avatar?: string;
  addresses: IAddress[];
  wishlist: mongoose.Types.ObjectId[];
  isEmailVerified: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        return !this.googleId;
      },
      minlength: 8,
      select: false,
    },
    googleId: { type: String, sparse: true, index: true },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'both'],
      default: 'local',
    },
    avatar: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    addresses: { type: [AddressSchema], default: [] },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    isEmailVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        delete ret['password'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
