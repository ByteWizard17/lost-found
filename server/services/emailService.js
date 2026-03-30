import nodemailer from "nodemailer";

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    });
    console.log("✅ Email sent:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Email error:", error);
    return false;
  }
};

export const notificationEmails = {
  itemMatch: (itemTitle, matchType) => ({
    subject: `🎉 Match Found! - ${itemTitle}`,
    html: `
      <h2>Great news! We found a potential match for your ${matchType} item!</h2>
      <p><strong>Item:</strong> ${itemTitle}</p>
      <p>Check your account to view details and claim the match.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Match</a>
    `,
  }),

  claimReceived: (itemTitle, claimerName) => ({
    subject: `📬 New Claim on Your Item - ${itemTitle}`,
    html: `
      <h2>Someone has claimed your item!</h2>
      <p><strong>Item:</strong> ${itemTitle}</p>
      <p><strong>Claimer:</strong> ${claimerName}</p>
      <p>Review their claim and accept or reject it.</p>
      <a href="${process.env.FRONTEND_URL}/my-items" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">View Claim</a>
    `,
  }),

  claimAccepted: (itemTitle) => ({
    subject: `✅ Your Claim Accepted - ${itemTitle}`,
    html: `
      <h2>Great! Your claim has been accepted!</h2>
      <p><strong>Item:</strong> ${itemTitle}</p>
      <p>The item owner will contact you soon with next steps.</p>
    `,
  }),

  itemApproved: (itemTitle) => ({
    subject: `✅ Your Post Approved - ${itemTitle}`,
    html: `
      <h2>Your post has been approved!</h2>
      <p><strong>Item:</strong> ${itemTitle}</p>
      <p>It's now visible to everyone and can be claimed.</p>
      <a href="${process.env.FRONTEND_URL}/dashboard" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Item</a>
    `,
  }),
};
