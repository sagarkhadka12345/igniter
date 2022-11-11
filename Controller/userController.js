export const userRegister = (req, res) => {
  try {
    const { fullname, phone, password } = req.body;
    if (password.length < 8 || password.length < 64) {
      res
        .status(400)
        .send(
          "password must be more than 8 characters and less than 64 characters"
        );
    } else if (phone.length < 10 || phone.length > 10) {
      res.status(400).send("phone must be 10 digits");
    }
  } catch (error) {}
};
