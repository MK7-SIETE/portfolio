const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Validation
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "All fields are required." }),
      };
    }

    // Email 1: Notification to you
    await sgMail.send({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Website Message: ${subject}`,
      html: `
        <h3>New Website Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // Email 2: Auto-reply to visitor
    await sgMail.send({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for reaching out, ${name}!`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #001f3f 0%, #003d7a 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #001f3f 0%, #003d7a 100%); padding: 40px 30px; text-align: center; border-radius: 20px 20px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Thank You, ${name}!</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Your message has been received</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <div style="background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 25px; border-radius: 15px; border-left: 5px solid #001f3f; margin-bottom: 30px;">
                <p style="margin: 0 0 15px; color: #2d3748; font-size: 16px;">Hi <strong>${name}</strong>,</p>
                <p style="margin: 0 0 15px; color: #2d3748; font-size: 16px;">
                  Thank you for getting in touch! I have received your message regarding <strong>"${subject}"</strong>.
                </p>
                <p style="margin: 0; color: #2d3748; font-size: 16px;">
                  I will get back to you <strong>within 24-48 hours</strong>. Looking forward to connecting!
                </p>
              </div>

              <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://betsamukuba.netlify.app/" style="display: inline-block; background: linear-gradient(135deg, #001f3f 0%, #003d7a 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                  View My Portfolio
                </a>
              </div>

              <div style="background: #f8fafc; padding: 25px; border-radius: 12px; text-align: center;">
                <h3 style="margin: 0 0 20px; color: #1a202c; font-size: 18px;">Get In Touch</h3>
                <p style="margin: 10px 0; color: #4a5568;">📧 mukuba950@gmail.com</p>
                <p style="margin: 10px 0; color: #4a5568;">📱 +260 96 950 8654</p>
                <p style="margin: 10px 0; color: #4a5568;">📍 Lusaka, Zambia</p>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <p style="margin: 0 0 15px; color: #4a5568; font-size: 14px;">Connect with me</p>
                <p>
                  <a href="https://linkedin.com/in/betsaleel-mukuba" style="color: #0077b5; margin: 0 10px; text-decoration: none;">LinkedIn</a> |
                  <a href="https://github.com/MK7-SIETE" style="color: #333333; margin: 0 10px; text-decoration: none;">GitHub</a> |
                  <a href="https://wa.me/260969508654" style="color: #25D366; margin: 0 10px; text-decoration: none;">WhatsApp</a> |
                  <a href="https://facebook.com/betsa.mukuba" style="color: #1877f2; margin: 0 10px; text-decoration: none;">Facebook</a>
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="background: #f8fafc; padding: 30px; text-align: center; border-top: 3px solid #e2e8f0; border-radius: 0 0 20px 20px;">
              <p style="margin: 0 0 5px; color: #718096; font-size: 14px;">Best regards,</p>
              <p style="margin: 0 0 5px; color: #001f3f; font-size: 20px; font-weight: 700;">Betsaleel Mukuba</p>
              <p style="margin: 0; color: #718096; font-size: 13px;">Developer | Tech Enthusiast | Problem Solver</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: "Email sending failed.",
        details: error.message 
      }),
    };
  }
};