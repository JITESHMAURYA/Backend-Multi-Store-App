//Import the necessary aws sdk modules for ses
const { SESClient, sendEmailCommand, SendEmailCommand } = require('@aws-sdk/client-ses');

//Load the environment variables from the .env file
require('dotenv').config();

//initialize the SES client using the environment variables

const client = new SESClient({
    region: process.env.AWS_REGION, //aws region to send emails from
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, //aws access for the authentication
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY //aws secret key for secure access
    }
})

//Function to generate simple HTML content for welcome email

const generateOtpEmailHtml = (otp) => {
    return `
    <html>
      <body>
        <h1>welcome to ${process.env.APP_NAME} </h1>
        <p>Your One-Time password (OTP) for email verification is: </p>
        <p>${otp}</p>
        <p>please enter this OTP to verify your email address. This code is valid for the next 10 minutes</p>
        <p>if you did not request this, please ignore this email or contact our support team immediately</p>
      </body>
    </html>       `
};

//function to send welcome email to the provided email address

const sendOtpEmail = async (email, otp) => {
    //Define the paramenters for the SES email message
    const params = {
        Source: process.env.EMAIL_FROM, //the sender's email address
        ReplyToAddress: [process.env.EMAIL_TO], //the reply to email address

        //destination
        Destination: {
            ToAddresses: [email], //the recipient's email address
        },

        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8", //ensure the email body is in utf-8 character encoding
                    Data: generateOtpEmailHtml(otp), //generate from the function above
                },
            },

            Subject: {
                Charset: "UTF-8", //ensure the email body is in utf-8 character encoding
                Data: `${process.env.APP_NAME} Email Verification`,
            },
        },

    };

    //create a new SendEmailCommand with the parameters defined above

    const command = new SendEmailCommand(params);

    try {
        //send the email using SES client and await response
        const data = await client.send(command);
        return data;
    } catch (error) {
        console.log("error sending emails");
        throw error;
    }

};

module.exports = sendOtpEmail;