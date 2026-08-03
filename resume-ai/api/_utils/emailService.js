import axios from 'axios';

const BREVO_API_KEY = process.env.BREVO_API_KEY || '';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@forge-ai.com';

export const sendEmail = async ({ toEmail, toName, subject, htmlContent }) => {
  if (!BREVO_API_KEY) {
    console.warn('[Email Service] BREVO_API_KEY is missing. Skipping email send.');
    return null;
  }

  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { name: 'Forge AI Recruitment', email: FROM_EMAIL },
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
    return null;
  }
};

export const sendUploadConfirmation = async (candidate) => {
  return sendEmail({
    toEmail: candidate.email,
    toName: candidate.name,
    subject: 'Resume Uploaded Successfully',
    htmlContent: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 20px;">Hello ${candidate.name},</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Your resume has been uploaded successfully to our AI Talent Database.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Our system is currently analyzing your profile for modern tech stack alignment. You can track your analysis results in the dashboard.
        </p>
        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Best regards,</p>
          <p style="color: #0f172a; font-weight: 800; font-size: 16px; margin: 4px 0;">Forge AI Recruitment Team</p>
        </div>
      </div>
    `,
  });
};

export const sendInterviewEmail = async (candidate, interviewDetails) => {
  const { date, time, link } = interviewDetails;
  return sendEmail({
    toEmail: candidate.email,
    toName: candidate.name,
    subject: `Interview Scheduled - Forge AI`,
    htmlContent: `
      <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-bottom: 20px;">Hello ${candidate.name},</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          Your technical interview has been scheduled by our HR Team.
        </p>
        
        <div style="background: #f8fafc; padding: 24px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #f1f5f9;">
          <div style="margin-bottom: 12px;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Date:</strong> <span style="color: #0f172a; font-weight: 700;">${date}</span></div>
          <div style="margin-bottom: 12px;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Time:</strong> <span style="color: #0f172a; font-weight: 700;">${time} (Online Room)</span></div>
          <div style="margin-top: 20px;">
            <p style="color: #475569; font-size: 14px; margin-bottom: 12px;">Please use the secure link below to join your interview session:</p>
            <a href="${link}" style="display: inline-block; background: #F4C400; color: #000; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 900; font-size: 14px; letter-spacing: 0.05em;">JOIN INTERVIEW SESSION</a>
          </div>
        </div>

        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Please ensure you have a stable connection and are in a quiet environment.</p>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">Good luck,</p>
          <p style="color: #0f172a; font-weight: 800; font-size: 16px; margin: 4px 0;">HR Talent Team</p>
        </div>
      </div>
    `,
  });
};
