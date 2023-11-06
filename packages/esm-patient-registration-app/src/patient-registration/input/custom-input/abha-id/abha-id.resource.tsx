import { v4 as uuidv4 } from 'uuid';
import { ABHA_BASE_URL } from './abha-id.component';

export const authModeForAbhaAddressVerification = async ({ abhaAddress }: { abhaAddress: string }) => {
  try {
    const requestId = uuidv4();
    const response = await fetch(ABHA_BASE_URL + '/users/auth/modes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: requestId,
        timestamp: new Date().toISOString(),
        query: {
          id: abhaAddress,
          purpose: 'KYC_AND_LINK',
          requester: {
            type: 'HIP',
            id: 'test-hip-01',
          },
        },
      }),
    });
    await response.text();
    return requestId;
  } catch (e) {
    // console.log('Error occured', e);
  }
};

export const generateMobileOTPForAbhaAddressVerification = async ({ abhaAddress }: { abhaAddress: string }) => {
  try {
    const requestId = uuidv4();
    const response = await fetch(ABHA_BASE_URL + '/users/auth/otp/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: requestId,
        timestamp: new Date().toISOString(),
        authMode: 'MOBILE_OTP',
        query: {
          id: abhaAddress,
          purpose: 'KYC_AND_LINK',
          requester: {
            type: 'HIP',
            id: 'test-hip-01',
          },
        },
      }),
    });
    await response.text();
    return requestId;
  } catch (e) {
    // console.log('Error occured', e);
  }
};

export const verifyMobileOTPForAbhaAddressVerification = async ({
  otp,
  transactionId,
}: {
  otp: string;
  transactionId: string;
}) => {
  try {
    const requestId = uuidv4();
    const response = await fetch(ABHA_BASE_URL + '/users/auth/otp/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: requestId,
        timestamp: new Date().toISOString(),
        transactionId: transactionId,
        credential: {
          authCode: otp,
        },
      }),
    });
    await response.text();
    return requestId;
  } catch (e) {
    // console.log('Error occured', e);
  }
};
