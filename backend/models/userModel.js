import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
)

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Criptografa a senha antes de salvar
userSchema.pre('save', async function () {
  // CORREÇÃO: no código original faltava o "return" depois do next(), então
  // mesmo sem troca de senha o código seguia e criptografava a senha (que já
  // estava criptografada) de novo, em paralelo ao salvamento. Era uma
  // "condição de corrida": dependendo do tempo, a senha errada podia ir para
  // o banco e a pessoa não conseguiria mais entrar.
  if (!this.isModified('password')) {
    return
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
