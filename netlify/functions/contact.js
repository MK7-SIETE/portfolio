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

    // Email 1: Notification to you (styled but clean)
    await sgMail.send({
      from: {
        email: process.env.EMAIL_USER,
        name: "Portfolio Contact Form"
      },
      to: process.env.EMAIL_USER,
      replyTo: {
        email: email,
        name: name
      },
      subject: `New Message: ${subject}`,
      text: `
New Website Message

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #001f3f 0%, #003d7a 100%); padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Message</h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 20px;">
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border-left: 4px solid #001f3f;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #6c757d; font-weight: 600;">FROM</p>
                    <p style="margin: 0; font-size: 16px; color: #212529; font-weight: 500;">${name}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border-left: 4px solid #001f3f;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #6c757d; font-weight: 600;">EMAIL</p>
                    <p style="margin: 0; font-size: 16px; color: #001f3f; font-weight: 500;">
                      <a href="mailto:${email}" style="color: #001f3f; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border-left: 4px solid #001f3f;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #6c757d; font-weight: 600;">SUBJECT</p>
                    <p style="margin: 0; font-size: 16px; color: #212529; font-weight: 500;">${subject}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px; background-color: #f8f9fa; border-left: 4px solid #001f3f;">
                    <p style="margin: 0 0 8px 0; font-size: 13px; color: #6c757d; font-weight: 600;">MESSAGE</p>
                    <p style="margin: 0; font-size: 15px; color: #212529; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; padding: 12px 30px; background-color: #001f3f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="padding: 20px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; font-size: 13px; color: #6c757d;">
                Sent from your portfolio contact form at betsamukuba.netlify.app
              </p>
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

    // Email 2: Auto-reply to visitor
    await sgMail.send({
      from: {
        email: process.env.EMAIL_USER,
        name: "Betsaleel Mukuba"
      },
      to: email,
      replyTo: process.env.EMAIL_USER,
      subject: `Re: ${subject}`,
      text: `
Hi ${name},

Thank you for reaching out! I have received your message regarding "${subject}" and truly appreciate you taking the time to contact me.

I will review your message carefully and get back to you within 24-48 hours. Looking forward to connecting with you!

---

Best regards,
Betsaleel Mukuba
Developer | Tech Enthusiast | Problem Solver

Get in Touch:
Email: mukuba950@gmail.com
Phone: +260 96 950 8654
Location: Lusaka, Zambia

Connect with me:
LinkedIn: https://linkedin.com/in/betsaleel-mukuba
GitHub: https://github.com/MK7-SIETE
WhatsApp: https://wa.me/260969508654
Facebook: https://facebook.com/betsa.mukuba

Portfolio: https://betsamukuba.netlify.app
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #001f3f 0%, #003d7a 100%); padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600;">Thank You, ${name}!</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 15px;">Your message has been received</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px 20px;">
              
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #212529; line-height: 1.6;">
                Hi <strong>${name}</strong>,
              </p>

              <p style="margin: 0 0 16px 0; font-size: 15px; color: #212529; line-height: 1.6;">
                Thank you for reaching out! I have received your message regarding <strong>"${subject}"</strong> and truly appreciate you taking the time to contact me.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; color: #212529; line-height: 1.6;">
                I will review your message carefully and get back to you <strong>within 24-48 hours</strong>. Looking forward to connecting with you!
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://betsamukuba.netlify.app" style="display: inline-block; padding: 14px 32px; background-color: #001f3f; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">View My Portfolio</a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 16px 0; font-size: 16px; color: #212529; font-weight: 600; text-align: center;">Get In Touch</p>
                    
                    <table width="100%" cellpadding="4" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <img src="https://img.icons8.com/fluency-systems-regular/20/001f3f/new-post.png" width="20" height="20" alt="" style="vertical-align: middle; margin-right: 8px;" />
                          <span style="font-size: 14px; color: #495057; vertical-align: middle;">Email:</span>
                          <a href="mailto:mukuba950@gmail.com" style="margin-left: 8px; font-size: 14px; color: #001f3f; text-decoration: none; font-weight: 500; vertical-align: middle;">mukuba950@gmail.com</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <img src="https://img.icons8.com/fluency-systems-regular/20/001f3f/phone.png" width="20" height="20" alt="" style="vertical-align: middle; margin-right: 8px;" />
                          <span style="font-size: 14px; color: #495057; vertical-align: middle;">Phone:</span>
                          <a href="tel:+260969508654" style="margin-left: 8px; font-size: 14px; color: #001f3f; text-decoration: none; font-weight: 500; vertical-align: middle;">+260 96 950 8654</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <img src="https://img.icons8.com/fluency-systems-regular/20/001f3f/marker.png" width="20" height="20" alt="" style="vertical-align: middle; margin-right: 8px;" />
                          <span style="font-size: 14px; color: #495057; vertical-align: middle;">Location:</span>
                          <span style="margin-left: 8px; font-size: 14px; color: #001f3f; font-weight: 500; vertical-align: middle;">Lusaka, Zambia</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #6c757d; font-weight: 600;">Connect with me</p>
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 0 8px;">
                          <a href="https://linkedin.com/in/betsaleel-mukuba" style="display: inline-block;">
                            <img src="https://img.icons8.com/color/32/linkedin.png" width="32" height="32" alt="LinkedIn" />
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://github.com/MK7-SIETE" style="display: inline-block;">
                            <img src="https://img.icons8.com/fluency/32/github.png" width="32" height="32" alt="GitHub" />
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://wa.me/260969508654" style="display: inline-block;">
                            <img src="https://img.icons8.com/color/32/whatsapp.png" width="32" height="32" alt="WhatsApp" />
                          </a>
                        </td>
                        <td style="padding: 0 8px;">
                          <a href="https://facebook.com/betsa.mukuba" style="display: inline-block;">
                            <img src="https://img.icons8.com/color/32/facebook.png" width="32" height="32" alt="Facebook" />
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="padding: 24px 20px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #dee2e6;">
              <p style="margin: 0 0 4px 0; font-size: 13px; color: #6c757d;">Best regards,</p>
              <p style="margin: 0 0 4px 0; font-size: 16px; color: #001f3f; font-weight: 700;">Betsaleel Mukuba</p>
              <p style="margin: 0; font-size: 12px; color: #6c757d;">Developer | Tech Enthusiast | Problem Solver</p>
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
