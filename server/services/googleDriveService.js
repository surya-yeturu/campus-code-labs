import crypto from 'crypto';

const tokenUrl = 'https://oauth2.googleapis.com/token';
const driveUploadUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink,webContentLink';
const drivePermissionUrl = (fileId) => `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;

const normalizePrivateKey = (key = '') => key.replace(/\\n/g, '\n');

export const isGoogleDriveConfigured = () =>
  Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_EMAIL &&
    process.env.GOOGLE_DRIVE_PRIVATE_KEY &&
    process.env.GOOGLE_DRIVE_FOLDER_ID
  );

const base64Url = (value) =>
  Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const getAccessToken = async () => {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(JSON.stringify({
    iss: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/drive',
    aud: tokenUrl,
    exp: now + 3600,
    iat: now,
  }));

  const unsigned = `${header}.${claim}`;
  const signature = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(normalizePrivateKey(process.env.GOOGLE_DRIVE_PRIVATE_KEY), 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Google auth failed: ${message}`);
  }

  const data = await response.json();
  return data.access_token;
};

const makePublic = async (fileId, accessToken) => {
  const response = await fetch(drivePermissionUrl(fileId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role: 'reader', type: 'anyone' }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Google Drive permission failed: ${message}`);
  }
};

export const uploadToGoogleDrive = async (buffer, folder, filename, contentType) => {
  const accessToken = await getAccessToken();
  const boundary = `ccl-${Date.now()}`;
  const metadata = {
    name: filename,
    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    description: `Campus Code Labs ${folder} file`,
  };

  const body = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`),
    Buffer.from(`--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`),
    buffer,
    Buffer.from(`\r\n--${boundary}--`),
  ]);

  const response = await fetch(driveUploadUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
      'Content-Length': String(body.length),
    },
    body,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Google Drive upload failed: ${message}`);
  }

  const file = await response.json();
  await makePublic(file.id, accessToken);

  return {
    url: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
    downloadUrl: file.webContentLink,
    path: file.id,
    provider: 'google-drive',
  };
};
