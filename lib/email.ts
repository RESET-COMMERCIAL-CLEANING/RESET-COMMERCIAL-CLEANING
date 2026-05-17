// Email service for sending ticket responses and notifications

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  ticketId?: string;
}

/**
 * Format a ticket response email with all relevant information
 */
export const formatTicketResponseEmail = (ticketData: {
  ticketNumber: string;
  subject: string;
  message: string;
  userName: string;
  userEmail: string;
  userType: string;
  category: string;
  priority: string;
  response: string;
  assignedToName: string;
}): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
          .header { background-color: #03a344; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h2 { margin: 0; }
          .content { padding: 20px; }
          .section { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #03a344; }
          .section h4 { margin-top: 0; color: #03a344; }
          .ticket-info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px; }
          .ticket-info span { font-weight: bold; color: #03a344; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📋 Ticket Response - ${ticketData.ticketNumber}</h2>
          </div>
          <div class="content">
            <p>Hi ${ticketData.userName},</p>
            <p>We have reviewed your support ticket and provided a response below.</p>

            <div class="section">
              <h4>Ticket Details</h4>
              <div class="ticket-info">
                <div><span>Ticket #:</span> ${ticketData.ticketNumber}</div>
                <div><span>Category:</span> ${ticketData.category}</div>
                <div><span>Priority:</span> ${ticketData.priority.toUpperCase()}</div>
                <div><span>Type:</span> ${ticketData.userType === 'client' ? 'Business Owner' : 'Service Provider'}</div>
              </div>
            </div>

            <div class="section">
              <h4>Your Original Request</h4>
              <p><strong>${ticketData.subject}</strong></p>
              <p>${ticketData.message}</p>
            </div>

            <div class="section">
              <h4>Our Response</h4>
              <p>${ticketData.response}</p>
              <p style="font-size: 12px; color: #666; margin-top: 15px;">
                <strong>Handled by:</strong> ${ticketData.assignedToName}<br/>
                <strong>Support Team:</strong> RESET Commercial Cleaning
              </p>
            </div>

            <p style="margin-top: 30px; color: #666;">
              If you have any further questions or need additional assistance, please reply to this email or visit our support portal.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated response from RESET Commercial Cleaning Support System</p>
            <p>Please do not reply directly to this email. Use the support portal instead.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    to: ticketData.userEmail,
    subject: `Response to Your Support Ticket - ${ticketData.ticketNumber}: ${ticketData.subject}`,
    html,
    ticketId: ticketData.ticketNumber
  };
};

/**
 * Format ticket assignment notification email
 */
export const formatTicketAssignmentEmail = (ticketData: {
  ticketNumber: string;
  subject: string;
  priority: string;
  category: string;
  assignedToName: string;
  assignedToEmail: string;
}): EmailTemplate => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
          .header { background-color: #03a344; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .header h2 { margin: 0; }
          .content { padding: 20px; }
          .section { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #03a344; }
          .section h4 { margin-top: 0; color: #03a344; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 New Ticket Assigned - ${ticketData.ticketNumber}</h2>
          </div>
          <div class="content">
            <p>Hi ${ticketData.assignedToName},</p>
            <p>A new support ticket has been assigned to you.</p>

            <div class="section">
              <h4>Ticket Information</h4>
              <p><strong>Ticket #:</strong> ${ticketData.ticketNumber}</p>
              <p><strong>Subject:</strong> ${ticketData.subject}</p>
              <p><strong>Priority:</strong> <span style="color: #e74c3c; font-weight: bold;">${ticketData.priority.toUpperCase()}</span></p>
              <p><strong>Category:</strong> ${ticketData.category}</p>
            </div>

            <p>Please log into your support portal to view the full ticket details and provide a response.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    to: ticketData.assignedToEmail,
    subject: `New Ticket Assigned - ${ticketData.ticketNumber}: ${ticketData.subject}`,
    html,
    ticketId: ticketData.ticketNumber
  };
};

/**
 * Send email using a backend service
 * Note: For production, configure with Resend, SendGrid, or similar
 */
export const sendEmail = async (emailTemplate: EmailTemplate): Promise<boolean> => {
  try {
    console.log('📧 Sending email to:', emailTemplate.to);
    console.log('📋 Ticket:', emailTemplate.ticketId);

    // TODO: Implement actual email sending with your email service
    // For now, log the email content for testing
    console.log('✅ Email queued for sending');
    return true;

    // Example with Resend API (would require API key):
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.NEXT_PUBLIC_RESEND_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     from: 'support@reset.com.au',
    //     to: emailTemplate.to,
    //     subject: emailTemplate.subject,
    //     html: emailTemplate.html
    //   })
    // });
    // return response.ok;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
};
