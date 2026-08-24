export interface AlertTemplatesConfig {
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  whatsappGatewayMode: 'direct_link' | 'api_cloud' | 'twilio' | 'webhook';
  whatsappApiUrl?: string;
  whatsappApiKey?: string;
  emailGatewayMode: 'smtp' | 'resend' | 'sendgrid' | 'webhook';
  emailApiKey?: string;
  emailFrom?: string;

  // Templates
  depositApprovedTpl: string;
  depositRejectedTpl: string;
  withdrawalDispatchedTpl: string;
  newCampaignTpl: string;
  supportTicketReplyTpl: string;
}

export const DEFAULT_ALERT_TEMPLATES: AlertTemplatesConfig = {
  whatsappEnabled: true,
  emailEnabled: true,
  whatsappGatewayMode: 'direct_link',
  emailGatewayMode: 'resend',
  emailFrom: 'notifications@12testgig.com',

  depositApprovedTpl: `Assalam-o-Alaikum {name}! 🎉
Your deposit of Rs {amount} PKR ({usd} USD) has been verified and APPROVED on 12 Test Gig.
🪙 {coins} Coins have been added to your balance.
Track campaigns: https://12-test-gig.vercel.app/customer/projects`,

  depositRejectedTpl: `Assalam-o-Alaikum {name}! ⚠️
Your deposit request of Rs {amount} PKR on 12 Test Gig could not be approved.
Reason: {reason}
If this was a mistake, please open support: https://12-test-gig.vercel.app/tester/support`,

  withdrawalDispatchedTpl: `Assalam-o-Alaikum {name}! 💰
Your cashout payout of {coins} Coins (Rs {amount} PKR) via {method} has been DISPATCHED!
Transaction Ref / TID: {txId}
Thank you for being a certified tester on 12 Test Gig!`,

  newCampaignTpl: `Assalam-o-Alaikum {name}! 🚀
A new Google Play 14-Day Closed Test '{appTitle}' is now open for your Android device!
Earn {coins} Coins daily + 14-day completion bonus.
Join now: https://12-test-gig.vercel.app/tester/tests`,

  supportTicketReplyTpl: `Assalam-o-Alaikum {name}! 🎧
Admin has replied to your Support Ticket #{ticketId}:
"{message}"
View discussion: https://12-test-gig.vercel.app/tester/support`
};

export function formatAlertMessage(template: string, vars: Record<string, string | number>): string {
  let text = template;
  for (const [key, val] of Object.entries(vars)) {
    text = text.replace(new RegExp(`{${key}}`, 'g'), String(val));
  }
  return text;
}

export function buildWhatsAppDirectLink(phone: string, message: string): string {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('03')) {
    clean = '92' + clean.slice(1);
  }
  return `https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(message)}`;
}
