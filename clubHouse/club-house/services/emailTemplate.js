const EmailTemplate = require("../model/emailTemplateModel");

const template = {};
template.createInvitationEmailTemplate = async () => {
  try {
    let existingTemplate = await EmailTemplate.findOne({
      where: { name: "InvitationEmail" },
    });
    console.log("Found template:", existingTemplate);

    if (!existingTemplate) {
      console.log("Template not found, creating a new one...");
      const newTemplate = await EmailTemplate.create({
        name: "InvitationEmail",
        subject: "You're Invited: Join {{clubName}} as a {{role}}",
        body: `
          <html>
            <body>
              <p>Hello,</p>
              <p>We're excited to invite you to join {{clubName}} as a {{role}}. To get started, please click the button below to accept your invitation and set up your account:</p>
              <p>
                <a href="{{token}}" style="
                  display: inline-block;
                  padding: 8px 16px;
                  font-size: 14px;
                  font-weight: bold;
                  color: #ffffff;
                  background-color: #007bff;
                  text-decoration: none;
                  border-radius: 4px;
                ">Accept Invitation</a>
              </p>
              <p>Please note that this link is valid for 24 hours. If you encounter any issues or have questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br>{{clubName}} Team</p>
            </body>
          </html>
        `,
      });
      console.log(
        "Invitation email template created successfully:",
        newTemplate
      );
      return newTemplate;
    } else {
      console.log(
        "Invitation email template already exists:",
        existingTemplate
      );
      return existingTemplate;
    }
  } catch (error) {
    console.error("Error ensuring invitation email template:", error);
    throw error;
  }
};

template.getEmailTemplate = async (name) => {
  try {
    console.log(`Retrieving email template: ${name}`);
    let template = await EmailTemplate.findOne({ where: { name } });

    if (!template) {
      template = await module.exports.createInvitationEmailTemplate();
    }
    return template;
  } catch (error) {
    console.error(`Error retrieving email template ${name}:`, error);
    throw error;
  }
};

module.exports = template;
