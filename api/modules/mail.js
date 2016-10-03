module.exports = {
    
    sendMail: function(config, mailOptions) {

        var transporter = nodemailer.createTransport(config.smtpConfig);

        transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                    console.log('Message sent: ' + info.response);
                });
    }
}
