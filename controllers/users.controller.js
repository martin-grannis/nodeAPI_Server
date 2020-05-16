const db = require("../models")
const UserModel = db.userModel
const Op = db.Sequelize.Op
const bcrypt = require("bcrypt")

// Create and Save a new UserModel
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name && !req.body.email) {
    res.status(400).send({
      message: "Name and email cannot both be empty!",
    })
    return
  }

  // Create a UserModel
  const UserData = {
    name: req.body.name,
    email: req.body.email,
    surname: req.body.surname,
    phone: req.body.phone,
    address1: req.body.address1,
    postcode: req.body.postcode,
    passwordHash: req.body.passwordHash,
  }

  // Save UserModel in the database
  UserModel.createdAt = Date.now()
  UserModel.updatedAt = Date.now()
  UserModel.create(UserData)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the UserModel.",
      })
    })
}

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  const email = req.query.email
  var condition = email ? { email: { [Op.like]: `%${email}%` } } : null

  UserModel.findAll({ where: condition })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      })
    })
}

// Find a single UserModel with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  UserModel.findByPk(id)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving UserModel with id=" + id,
      })
    })
}

// Update a UserModel by the id in the request
exports.update = (req, res) => {
  const id = req.params.id

  UserModel.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "UserModel was updated successfully.",
        })
      } else {
        res.send({
          message: `Cannot update UserModel with id=${id}. Maybe UserModel was not found or req.body is empty!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating UserModel with id=" + id,
      })
    })
}

// Delete a UserModel with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id

  UserModel.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "UserModel was deleted successfully!",
        })
      } else {
        res.send({
          message: `Cannot delete UserModel with id=${id}. Maybe UserModel was not found!`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete UserModel with id=" + id,
      })
    })
}

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  UserModel.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Users were deleted successfully!` })
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Users.",
      })
    })
}

// find all published UserModel
exports.findAllPublished = (req, res) => {
  UserModel.findAll({ where: { published: true } })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      })
    })
}

// calcPasswordHash = async (password) =>  {
//   const hashCost = 10
//   const passwordHash =  await bcrypt.hash(password, hashCost).then()
//   return passwordHash
// }

// async function hashPassword(password) {
//   //  const password = user.password
//   const saltRounds = 10

//   const hashedPassword = await new Promise((resolve, reject) => {
//     bcrypt.hash(password, saltRounds, function (err, hash) {
//       if (err) reject(err)
//       resolve(hash)
//     })
//   })

//   return hashedPassword
// }

//////////////// protection stuff goes here
exports.register = async (req, res) => {
  console.log("register received")
  const { name, email, phone, password, password2, surname } = req.body
  
  let errors = []
  // do my noddy validation
  if (email.length == 0) {
    errors.push({ email: "Email address missing" })
  }
  if (email.indexOf("@") == -1) {
    errors.push({ email: "Email address is not valid" })
  }
  if (name.length == 0) {
    errors.push({ name: "First name must be supplied" })
  }

  if (errors.length > 0) {
    res.render('registerForm', {
      errors, name, email, password, password2, surname,
    })
  }
  else {
    res.send('pass')
  }

  
  // const { email, password } = req.body
  // var condition = { email: { [Op.like]: `%${email}%` } }

  // UserModel.findAll({ where: condition })
  //   .then((data) => {
  //     if (data.length > 0) {
  //       res.status(400).send({
  //         error: "user already registered",
  //       })
  //     } else {
  //       const passwordHash = bcrypt.hashSync(password, 10);
  //       const userDocument = new UserModel({ email, passwordHash })
  //       userDocument.save()
  //       res.status(200).send({ email })
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || "Some error occurred while retrieving Users.",
  //     })
  //   })
}

exports.login = (req, res) => {
  passport.authenticate("local", { session: false }, (error, UserModel) => {
    if (error || !UserModel) {
      res.status(400).json({ error })
    }

    /** This is what ends up in our JWT */
    const payload = {
      username: UserModel.username,
      expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS),
    }

    /** assigns payload to req.UserModel */
    req.login(payload, { session: false }, (error) => {
      if (error) {
        res.status(400).send({ error })
      }

      /** generate a signed json web token and return it in the response */
      const token = jwt.sign(JSON.stringify(payload), keys.secret)

      /** assign our jwt to the cookie */
      res.cookie("jwt", jwt, { httpOnly: true, secure: true })
      res.status(200).send({ username })
    })
  })(req, res)
}
