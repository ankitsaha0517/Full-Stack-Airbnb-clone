const User = require('../model/user');


module.exports.renderSignupFrom = (req, res) => {
    res.render('./user/signup.ejs');
}

module.exports.signup = async (req, res) => {
    try{
        let{ username, email, password } = req.body;
        let newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        //signup and auto login
        req.login(registeredUser,(err)=> {
            if (err) { return next(err)}
            req.flash('sucess', 'Welcome to AirBnb');
            res.redirect('/listing');
        });

    }catch(error){
        req.flash('error', error.message );
        res.redirect("/signup")
    }
}

module.exports.renderLogInFrom = (req,res)=>{
    res.render('./user/login.ejs')
}

module.exports.logIn =  async(req,res)=>{
    let {username} = req.body
    const redirctUrl = res.locals.redirectUrl || '/listing'
    console.log(redirctUrl);
    req.flash('sucess', `Welcome back ${username}`);
    res.redirect(redirctUrl)

}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=> {
        if (err) { return next(err)}
        req.flash('sucess', "Goodby! You've been logged out!");
        res.redirect('/listing');
    });
}