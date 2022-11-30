import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import express from 'express'

const router = express.Router()

router.post('/register', async (req, res) => {
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
  try {
    await user.save()
    return res.status(200).send('User has been created.')
  } catch (error) {
    res.status(500).json(error)
  }
})

export default router
