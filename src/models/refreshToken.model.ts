import { Schema, Document, Model, model } from 'mongoose';
import { jwtExpiration, jwtRefreshExpiration } from '../config/config';
const { v4: uuidv4 } = require('uuid');

interface RefreshTokenDocument extends Document {
    token: string;
    expiryDate: Date;
    userId: Schema.Types.ObjectId;
}

interface RefreshTokenModel extends Model<RefreshTokenDocument> {
    createToken(userId: string): string;
    verifyExpiration(token: RefreshTokenDocument): boolean;
}

const RefreshTokenSchema = new Schema<RefreshTokenDocument, RefreshTokenModel>({
    token: { type: String, required: true },
    expiryDate: { type: Date },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

RefreshTokenSchema.static('createToken', async function createToken(_userId) {
    console.log('creterefreshToken');
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

    console.log('object', _object);

    let refreshToken = await _object.save();
    console.log('refresh', refreshToken);

    return refreshToken.token;
});

RefreshTokenSchema.static('verifyExpiration', function verifyExpiration(token) {
    return token.expiryDate.getTime() < new Date().getTime();
});

const RefreshToken: RefreshTokenModel = model<RefreshTokenDocument, RefreshTokenModel>('RefreshToken', RefreshTokenSchema);

export default RefreshToken;
