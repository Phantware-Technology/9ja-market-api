import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import express from 'express'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().min(3).max(200).required().email(),
      password: Joi.string().min(6).max(200),
    })

    const { error } = schema.validate(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send('User already exist')

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)

    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    })

    await user.save()

    const token = generateAuthToken(user)

    return res.status(200).json(token)
  } catch (error) {
    return res.status(500).json(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().min(3).max(200).required().email(),
      password: Joi.string().min(6).max(200),
    })

    const { error } = schema.validate(req.body)

    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Invalid email or password')

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!isPasswordCorrect)
      return res.status(400).send('Invalid email or password')

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT
    )
    const { password, ...info } = user._doc

    return res.status(200).json({ ...info, token })
  } catch (error) {
    return res.status(500).json(error)
  }
})
export default router
