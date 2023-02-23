import { Schema, Document, Model, model } from 'mongoose';
import testDb from '../database/init.multi.mongodb';
import { jwtRefreshExpiration } from '../config/config';
import { v4 as uuidv4 } from 'uuid';

interface refreshTokenDocument extends Document {
    token: string;
    expiryDate: Date;
    userId: Schema.Types.ObjectId;
}

interface refreshTokenModel extends Model<refreshTokenDocument> {
    createToken(userId: string): string;
    verifyExpiration(token: refreshTokenDocument): boolean;
}

const refreshTokenSchema = new Schema<refreshTokenDocument, refreshTokenModel>({
    token: { type: String, required: true },
    expiryDate: { type: Date },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

refreshTokenSchema.static('createToken', async function createToken(_userId) {
    console.log('creteRefreshToken');
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + jwtRefreshExpiration);

    let _token = uuidv4();
    // console.log(_token);
    // console.log(expiredAt.getTime());
    // console.log(_userId);

    let _object = new this({
        token: _token,
        userId: _userId,
        expiryDate: expiredAt.getTime()
    });

    let refreshToken = await _object.save();
    console.log('refresh', refreshToken);

    return refreshToken.token;
});

refreshTokenSchema.static('verifyExpiration', function verifyExpiration(token) {
    return token.expiryDate.getTime() < new Date().getTime();
});

const refreshToken: refreshTokenModel = testDb.model<refreshTokenDocument, refreshTokenModel>('RefreshToken', refreshTokenSchema);

export default refreshToken;
