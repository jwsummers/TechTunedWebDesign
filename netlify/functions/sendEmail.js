const sgMail = require('@sendgrid/mail');

// Load the SendGrid API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
    // Ensure it's a POST request
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        // Parse the form data
        const querystring = require('querystring');
const { name, email, comment } = querystring.parse(event.body);


        // Set up the email content
        const msg = {
            to: 'contact@techtunedwebdesign.com',
            from: 'contact@techtunedwebdesign.com',
            subject: `New Contact Form Submission from ${name}`,
            text: `You received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${comment}`,
        };

        // Send the email
        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send email' }),
        };
    }
};
