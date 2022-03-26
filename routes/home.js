module.exports = {
    getHomePage: (req, res) => {
        res.render('home.ejs', {title: "HomePage"});
    }
}
