const axios = require('axios');
require('dotenv').config();

const BREVO_API_KEY = process.env.BREVO_API_KEY || 'your_brevo_api_key_here';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { name: 'Forge AI Recruitment', email: 'no-reply@forge-ai.com' },
        to: [{ email: toEmail, name: toName }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'api-key': BREVO_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    console.log(`[Email Service] Success: Sent email to ${toEmail}`);
    return response.data;
  } catch (error) {
    console.error(`[Email Service] Error sending email to ${toEmail}:`, error.response?.data || error.message);
    // Silent fail for demo if key is missing, but log it
    return null;
  }
};

const sendUploadConfirmation = async (candidate) => {
  return sendEmail({
    toEmail: candidate.email,
    toName: candidate.name,
    subject: 'Resume Uploaded Successfully',
    htmlContent: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 20px;">Hello ${candidate.name},</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Your resume has been uploaded successfully.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Our system is currently analyzing your resume based on the selected job role. You will receive further updates soon.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Thank you,</p>
          <p style="color: #0f172a; font-weight: 800; font-size: 16px; margin: 4px 0;">AI Recruitment Team</p>
        </div>
      </div>
    `,
  });
};

const sendInterviewEmail = async (candidate, interviewDetails) => {
  const { date, time, link } = interviewDetails;
  return sendEmail({
    toEmail: candidate.email,
    toName: candidate.name,
    subject: `Interview Scheduled`,
    htmlContent: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 20px;">Hello ${candidate.name},</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Your interview has been scheduled successfully.
        </p>
        
        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
          <div style="margin-bottom: 12px;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Date:</strong> <span style="color: #0f172a; font-weight: 700;">${date}</span></div>
          <div style="margin-bottom: 12px;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Time:</strong> <span style="color: #0f172a; font-weight: 700;">${time} (Online)</span></div>
          <div style="margin-top: 20px;">
            <p style="color: #475569; font-size: 14px; margin-bottom: 12px;">Please use the link below to join the interview:</p>
            <a href="${link}" style="display: inline-block; background: #F4C400; color: #000; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 900; font-size: 14px; letter-spacing: 0.05em;">JOIN INTERVIEW NOW</a>
          </div>
        </div>

        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Make sure to join on time.</p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Thank you,</p>
          <p style="color: #0f172a; font-weight: 800; font-size: 16px; margin: 4px 0;">HR Team</p>
        </div>
      </div>
    `,
  });
};

const sendSelectionEmail = async (candidate) => {
  return sendEmail({
    toEmail: candidate.email,
    toName: candidate.name,
    subject: `Application Status Update`,
    htmlContent: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 20px;">Hello ${candidate.name},</h2>
        <p style="color: #10b981; font-size: 24px; font-weight: 900; margin-bottom: 20px;">Congratulations!</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          You have been shortlisted / selected for the next stage of the recruitment process.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Our team will contact you with further details soon.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Thank you,</p>
          <p style="color: #0f172a; font-weight: 800; font-size: 16px; margin: 4px 0;">HR Team</p>
        </div>
      </div>
    `,
  });
};

const sendRejectionEmail = async (candidate) => {
  return sendEmail({
    toEmail: candidate.email,
    toName: candidate.name,
    subject: `Application Status Update`,
    htmlContent: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 20px;">Hello ${candidate.name},</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Thank you for applying.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          After reviewing your profile, we regret to inform you that you have not been selected for this role at this time.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          We appreciate your interest and wish you all the best for your future opportunities.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Thank you,</p>
          <p style="color: #0f172a; font-weight: 800; font-size: 16px; margin: 4px 0;">HR Team</p>
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendUploadConfirmation,
  sendInterviewEmail,
  sendSelectionEmail,
  sendRejectionEmail
};
