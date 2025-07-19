import { Document, Model } from 'mongoose';
export interface IUser extends Document {
    username: string;
    password: string;
    nickname: string;
    highScore: number;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface IUserModel extends Model<IUser> {
}
declare const User: IUserModel;
export default User;
//# sourceMappingURL=User.d.ts.map