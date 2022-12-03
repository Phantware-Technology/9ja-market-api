import jwt from 'jsonwebtoken'

const generateAuthToken = (user) => {
  const jwtSecretKey = process.env.JWT
  const token = jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    jwtSecretKey
  )

  return token
}

export default generateAuthToken
