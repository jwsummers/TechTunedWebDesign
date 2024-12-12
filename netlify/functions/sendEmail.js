const sgMail = require("@sendgrid/mail");

// Load the SendGrid API Key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  // Ensure it's a POST request
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Parse the form data
    const querystring = require("querystring");
    const { name, email, comment, website, formTimestamp } = querystring.parse(
      event.body
    );

    // Honeypot check
    if (website) {
      console.warn("Honeypot triggered!");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Spam detected!" }),
      };
    }

    // Time-based validation
    const now = Date.now();
    const submissionTime = parseInt(formTimestamp, 10);

    if (now - submissionTime < 3000) {
      // Adjust threshold (3 seconds) as needed
      console.warn("Form submitted too quickly.");
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Form submitted too quickly. Please try again.",
        }),
      };
    }

    // Set up the email content
    const msg = {
      to: "contact@techtunedwebdesign.com",
      from: "contact@techtunedwebdesign.com",
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${comment}`,
    };

    // Send the email
    await sgMail.send(msg);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to send email" }),
    };
  }
};
