type EmailRecipient = string | string[];

type GmailParams = {
  to: EmailRecipient;
  cc?: EmailRecipient;
  subject?: string;
  body?: string;
};

const encodeList = (value?: EmailRecipient) => {
  if (!value) return '';
  return Array.isArray(value) ? value.join(',') : value;
};

export const buildGmailUrl = ({ to, cc, subject, body }: GmailParams) => {
  const base = 'https://mail.google.com/mail/?view=cm&fs=1';
  const toParam = encodeURIComponent(encodeList(to));
  const ccParam = cc ? `&cc=${encodeURIComponent(encodeList(cc))}` : '';
  const subjectParam = subject ? `&su=${encodeURIComponent(subject)}` : '';
  const bodyParam = body ? `&body=${encodeURIComponent(body)}` : '';
  return `${base}&to=${toParam}${ccParam}${subjectParam}${bodyParam}`;
};

export const openGmailCompose = (params: GmailParams) => {
  const url = buildGmailUrl(params);
  window.open(url, '_blank', 'noopener');
};
