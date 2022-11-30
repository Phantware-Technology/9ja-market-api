import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: {
      type: String,
      minlength: 3,
      maxlength: 300,
      required: true,
      unique: true,
    },
    password: { type: String, minlength: 3, maxlength: 1024, required: true },
  },
  { timestamps: true }
)

export default mongoose.model('User', UserSchema)
