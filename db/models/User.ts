import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Interface for the User document
export interface IUser extends Document {
  username: string;
  password: string;
  highScore: number;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for the User model (for static methods, if any)
export interface IUserModel extends Model<IUser> {}

const UserSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  highScore: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser, IUserModel>('User', UserSchema);

export default User;
