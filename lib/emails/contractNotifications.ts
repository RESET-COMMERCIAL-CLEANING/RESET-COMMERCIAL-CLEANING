// Email notifications for contract workflow events

export interface EmailPayload {
  to: string;
  subject: string;
  htmlContent: string;
  textContent: string;
}

/**
 * Email when contract is generated and ready for signature
 */
export function generateContractReadyEmail(params: {
  recipientName: string;
  recipientEmail: string;
  contractType: 'business-owner' | 'subcontractor';
  contractId: string;
  company?: string;
  firstName?: string;
  lastName?: string;
}): EmailPayload {
  const { recipientName, recipientEmail, contractType, contractId, company, firstName, lastName } = params;

  const contractName = contractType === 'business-owner' ? company : `${firstName} ${lastName}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3a9e68 0%, #2d7d52 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .button { display: inline-block; background: #3a9e68; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
    .footer { color: #999; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Contract Ready for Signature</h1>
      <p>RESET Commercial Cleaning</p>
    </div>

    <div class="content">
      <p>Hi ${recipientName},</p>

      <p>Your service agreement for <strong>${contractName}</strong> has been generated and is ready for your digital signature.</p>

      <p><strong>Contract Details:</strong></p>
      <ul>
        <li>Contract ID: ${contractId}</li>
        <li>Type: ${contractType === 'business-owner' ? 'Business Owner Agreement' : 'Service Provider Agreement'}</li>
        <li>Status: Pending Your Signature</li>
      </ul>

      <p>Please log in to your RESET portal to review and digitally sign your contract.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://resetcleaning.com/portal" class="button">View Contract & Sign</a>
      </div>

      <p><strong>Important:</strong></p>
      <ul>
        <li>Contracts expire after 30 days without signature</li>
        <li>Once signed, our team will review and approve within 2 business days</li>
        <li>You'll receive a confirmation email when approved</li>
      </ul>

      <p>If you have any questions, please don't hesitate to contact our support team.</p>

      <p>Best regards,<br><strong>RESET Commercial Cleaning Team</strong></p>
    </div>

    <div class="footer">
      <p>This is an automated message. Please do not reply directly to this email.</p>
      <p>&copy; 2026 RESET Commercial Cleaning. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Contract Ready for Signature

Hi ${recipientName},

Your service agreement for ${contractName} has been generated and is ready for your digital signature.

Contract ID: ${contractId}
Type: ${contractType === 'business-owner' ? 'Business Owner Agreement' : 'Service Provider Agreement'}
Status: Pending Your Signature

Please log in to your RESET portal to review and digitally sign your contract.

https://resetcleaning.com/portal

Important:
- Contracts expire after 30 days without signature
- Once signed, our team will review and approve within 2 business days
- You'll receive a confirmation email when approved

If you have any questions, please contact our support team.

Best regards,
RESET Commercial Cleaning Team
  `;

  return {
    to: recipientEmail,
    subject: `Contract Ready for Signature - ${contractName}`,
    htmlContent,
    textContent,
  };
}

/**
 * Email when contract is assigned to subcontractor
 */
export function generateContractAssignmentEmail(params: {
  subcontractorName: string;
  subcontractorEmail: string;
  contractId: string;
  clientName: string;
  location: string;
  frequency: string;
  cleaningType: string;
}): EmailPayload {
  const { subcontractorName, subcontractorEmail, contractId, clientName, location, frequency, cleaningType } = params;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3a9e68 0%, #2d7d52 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .job-card { background: white; border-left: 4px solid #3a9e68; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .button { display: inline-block; background: #3a9e68; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
    .footer { color: #999; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Job Assignment</h1>
      <p>RESET Commercial Cleaning</p>
    </div>

    <div class="content">
      <p>Hi ${subcontractorName},</p>

      <p>Great news! You've been assigned a new contract with <strong>${clientName}</strong>.</p>

      <div class="job-card">
        <h3>${clientName}</h3>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Service Type:</strong> ${cleaningType}</p>
        <p><strong>Frequency:</strong> ${frequency}</p>
        <p><strong>Contract ID:</strong> ${contractId}</p>
      </div>

      <p><strong>What's Next:</strong></p>
      <ol>
        <li>Log in to your RESET portal</li>
        <li>View the contract details and assigned checklist</li>
        <li>Review the auto-generated cleaning checklist</li>
        <li>Accept the job assignment (if applicable)</li>
      </ol>

      <p>Your auto-generated cleaning checklist has been created based on the property type and service requirements. You can view and customize it in your portal.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://resetcleaning.com/portal/subcontractor" class="button">View Assignment</a>
      </div>

      <p><strong>Estimated Earnings:</strong> Contact our team for rate information</p>

      <p>If you have any questions or concerns about this assignment, please reply to this email or contact support.</p>

      <p>Best regards,<br><strong>RESET Commercial Cleaning Team</strong></p>
    </div>

    <div class="footer">
      <p>This is an automated message from RESET Commercial Cleaning.</p>
      <p>&copy; 2026 RESET Commercial Cleaning. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
New Job Assignment

Hi ${subcontractorName},

Great news! You've been assigned a new contract with ${clientName}.

Location: ${location}
Service Type: ${cleaningType}
Frequency: ${frequency}
Contract ID: ${contractId}

What's Next:
1. Log in to your RESET portal
2. View the contract details and assigned checklist
3. Review the auto-generated cleaning checklist
4. Accept the job assignment (if applicable)

Your auto-generated cleaning checklist has been created based on the property type and service requirements.

View Assignment: https://resetcleaning.com/portal/subcontractor

If you have any questions about this assignment, please reply to this email or contact support.

Best regards,
RESET Commercial Cleaning Team
  `;

  return {
    to: subcontractorEmail,
    subject: `New Job Assignment - ${clientName}`,
    htmlContent,
    textContent,
  };
}

/**
 * Email when contract is approved
 */
export function generateContractApprovedEmail(params: {
  recipientName: string;
  recipientEmail: string;
  contractType: 'business-owner' | 'subcontractor';
  contractName: string;
  approvalDate: string;
}): EmailPayload {
  const { recipientName, recipientEmail, contractType, contractName, approvalDate } = params;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3a9e68 0%, #2d7d52 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }
    .success-icon { font-size: 48px; margin: 10px 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .button { display: inline-block; background: #3a9e68; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
    .footer { color: #999; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">✓</div>
      <h1>Contract Approved!</h1>
      <p>Your agreement is now active</p>
    </div>

    <div class="content">
      <p>Hi ${recipientName},</p>

      <p>Congratulations! Your contract has been reviewed and approved by RESET.</p>

      <p><strong>Contract Details:</strong></p>
      <ul>
        <li>Contract Name: ${contractName}</li>
        <li>Type: ${contractType === 'business-owner' ? 'Business Owner Agreement' : 'Service Provider Agreement'}</li>
        <li>Approved Date: ${approvalDate}</li>
        <li>Status: <span style="color: #3a9e68; font-weight: bold;">Active</span></li>
      </ul>

      <p>${contractType === 'business-owner'
        ? 'Your cleaning services will begin according to the agreed schedule. Our team will contact you soon to confirm the first service date.'
        : 'Your contract is now active. You can view your assigned work and checklists in your RESET portal.'}</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://resetcleaning.com/portal" class="button">View Contract Details</a>
      </div>

      <p><strong>Next Steps:</strong></p>
      ${contractType === 'business-owner' ? `
      <ul>
        <li>Our service team will prepare for your first cleaning</li>
        <li>You'll receive a confirmation email with the scheduled date and time</li>
        <li>Access your portal to track ongoing cleanings and view quality reports</li>
      </ul>
      ` : `
      <ul>
        <li>View your assigned contract in the portal</li>
        <li>Review the auto-generated cleaning checklist</li>
        <li>Start accepting and completing assigned work</li>
        <li>Track your earnings and performance metrics</li>
      </ul>
      `}

      <p>If you have any questions, please contact our support team.</p>

      <p>Best regards,<br><strong>RESET Commercial Cleaning Team</strong></p>
    </div>

    <div class="footer">
      <p>This is an automated message from RESET Commercial Cleaning.</p>
      <p>&copy; 2026 RESET Commercial Cleaning. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Contract Approved!

Hi ${recipientName},

Congratulations! Your contract has been reviewed and approved by RESET.

Contract Name: ${contractName}
Type: ${contractType === 'business-owner' ? 'Business Owner Agreement' : 'Service Provider Agreement'}
Approved Date: ${approvalDate}
Status: Active

${contractType === 'business-owner'
  ? 'Your cleaning services will begin according to the agreed schedule. Our team will contact you soon to confirm the first service date.'
  : 'Your contract is now active. You can view your assigned work and checklists in your RESET portal.'}

View Contract Details: https://resetcleaning.com/portal

Next Steps:
${contractType === 'business-owner' ? `
- Our service team will prepare for your first cleaning
- You'll receive a confirmation email with the scheduled date and time
- Access your portal to track ongoing cleanings and view quality reports
` : `
- View your assigned contract in the portal
- Review the auto-generated cleaning checklist
- Start accepting and completing assigned work
- Track your earnings and performance metrics
`}

If you have any questions, please contact our support team.

Best regards,
RESET Commercial Cleaning Team
  `;

  return {
    to: recipientEmail,
    subject: `Contract Approved - ${contractName}`,
    htmlContent,
    textContent,
  };
}

/**
 * Email reminder for pending approvals (sent to superuser)
 */
export function generatePendingApprovalReminderEmail(params: {
  superuserName: string;
  superuserEmail: string;
  contractsAwaitingReview: number;
  contractsAwaitingSignature: number;
}): EmailPayload {
  const { superuserName, superuserEmail, contractsAwaitingReview, contractsAwaitingSignature } = params;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3a9e68 0%, #2d7d52 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
    .button { display: inline-block; background: #3a9e68; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
    .footer { color: #999; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pending Approvals Reminder</h1>
      <p>RESET Admin Dashboard</p>
    </div>

    <div class="content">
      <p>Hi ${superuserName},</p>

      <p>You have pending contracts awaiting action:</p>

      <div class="alert">
        <strong>📋 Awaiting Review:</strong> ${contractsAwaitingReview} contract(s)<br>
        <strong>✍️ Awaiting Signature:</strong> ${contractsAwaitingSignature} contract(s)<br>
      </div>

      <p>These contracts are waiting for your attention in the RESET admin portal. Please review and take appropriate action when possible.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://resetcleaning.com/portal/admin" class="button">Go to Admin Dashboard</a>
      </div>

      <p><strong>Quick Actions:</strong></p>
      <ul>
        <li>Review contract details and information</li>
        <li>Generate contract PDFs for signature</li>
        <li>Assign contracts to subcontractors</li>
        <li>Approve and activate contracts</li>
      </ul>

      <p>This is an automated reminder to help keep your workflow on track.</p>

      <p>Best regards,<br><strong>RESET System</strong></p>
    </div>

    <div class="footer">
      <p>This is an automated message from RESET Commercial Cleaning Admin.</p>
      <p>&copy; 2026 RESET Commercial Cleaning. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;

  const textContent = `
Pending Approvals Reminder

Hi ${superuserName},

You have pending contracts awaiting action:

Awaiting Review: ${contractsAwaitingReview} contract(s)
Awaiting Signature: ${contractsAwaitingSignature} contract(s)

These contracts are waiting for your attention in the RESET admin portal.

Go to Admin Dashboard: https://resetcleaning.com/portal/admin

Quick Actions:
- Review contract details and information
- Generate contract PDFs for signature
- Assign contracts to subcontractors
- Approve and activate contracts

This is an automated reminder to help keep your workflow on track.

Best regards,
RESET System
  `;

  return {
    to: superuserEmail,
    subject: `Pending Contract Approvals - Action Required`,
    htmlContent,
    textContent,
  };
}

/**
 * Send email function (integrate with your email service provider)
 * Currently returns the payload - you'll integrate with SendGrid, AWS SES, or similar
 */
export async function sendEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // TODO: Integrate with email service provider (SendGrid, AWS SES, Nodemailer, etc.)
  // For now, just return the payload for logging
  console.log('Email to send:', {
    to: payload.to,
    subject: payload.subject,
    contentLength: payload.htmlContent.length,
  });

  // Example integration with SendGrid:
  /*
  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: 'noreply@resetcleaning.com', name: 'RESET Commercial Cleaning' },
        subject: payload.subject,
        content: [
          { type: 'text/plain', value: payload.textContent },
          { type: 'text/html', value: payload.htmlContent },
        ],
      }),
    });

    if (!response.ok) throw new Error(`SendGrid error: ${response.statusText}`);

    return { success: true, messageId: response.headers.get('x-message-id') || undefined };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: String(error) };
  }
  */

  return { success: true };
}
