//logic related to common routes like login... goes here

app.post('/createUser', async (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var type = req.body.type;

    const schema = Joi.object({
        firstName: Joi.string().alphanum().max(20).required(),
        lastName: Joi.string().alphanum().max(20).required(),
        email: Joi.string().email().max(30).required(),
        password: Joi.string().max(20).required()
    });
    const validationResult = schema.validate({firstName, lastName, email, password});
    /*
    if (validationResult.error != null) {
        res.send(`
            Invalid email/password combination.<br><br>
            <a href="/signup">Try again</a>
            `);
        return;
    }
    */
    var hashedPassword = await bcrypt.hash(password, saltRounds);

    await userCollection.insertOne({firstName: firstName, lastName: lastName, email: email, password: hashedPassword, type: type});

    res.redirect("/");
});