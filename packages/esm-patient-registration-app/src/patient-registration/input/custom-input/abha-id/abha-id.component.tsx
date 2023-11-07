import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput } from '@carbon/react';
import { PatientIdentifierValue } from '../../../patient-registration.types';
import {
  authModeForAbhaAddressVerification,
  generateMobileOTPForAbhaAddressVerification,
  verifyMobileOTPForAbhaAddressVerification,
} from './abha-id.resource';
import { PatientRegistrationContext } from '../../../patient-registration-context';

interface AuthModeResponse {
  requestId: string;
  timestamp: string;
  auth: {
    modes: string[];
    purpose: string;
  };
  error: null | { code: number; message: string };
  resp: {
    requestId: string;
  };
}

export const ABHA_BASE_URL = 'https://hmsicare.liferythem.com/api';
// export const ABHA_BASE_URL = "https://lifer.pagekite.me/api";

function AbhaId({ patientIdentifier }: { patientIdentifier: PatientIdentifierValue }) {
  const { setFieldValue } = useContext(PatientRegistrationContext);
  const [requestId, setRequestId] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [availableVerificationOptions, setAvailableVerificationOptions] = useState<string[]>([]);
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otp, setOtp] = useState<string>('');
  const [patient, setPatient] = useState<any>({});
  const [error, setError] = useState('');
  const [resendOtp, setResendOtp] = useState(false);
  let evtSource = new EventSource(ABHA_BASE_URL + '/sse/');

  useEffect(() => {
    if (requestId) {
      fire();
    }
    () => {
      evtSource.close();
    };
  }, [requestId]);

  useEffect(() => {
    // Name: First Middle Last
    // Gender: M/F
    // DOB: DD/MM/YYYY
    if (patient.id) {
      if (patient.name?.split(' ')?.length == 3) {
        let patientFullName = patient.name?.split(' ');
        setFieldValue('givenName', patientFullName?.[0]);
        setFieldValue('familyName', patientFullName?.[2]);
        setFieldValue('middleName', patientFullName?.[1]);
      } else if (patient.name?.split(' ')?.length == 2) {
        let patientFullName = patient.name?.split(' ');
        setFieldValue('givenName', patientFullName?.[0]);
        setFieldValue('familyName', patientFullName?.[1]);
      }
      setFieldValue('gender', getGender(patient.gender));
      setFieldValue(
        'birthdate',
        new Date(`${patient.yearOfBirth + '-' + patient.monthOfBirth + '-' + patient.dayOfBirth}`),
      );
    }
  }, [patient]);

  const fire = () => {
    evtSource.onmessage = (e) => {
      checkForLatestRequestId({ responseList: JSON.parse(e.data) });
    };
    // console.log('started listening');
  };

  const checkForLatestRequestId = ({ responseList }: { responseList: AuthModeResponse[] }) => {
    // console.log(responseList);
    const response: any = responseList?.find((response: AuthModeResponse) => response?.resp?.requestId === requestId);
    if (response?.error?.message) {
      setAvailableVerificationOptions([]);
      setRequestId('');
      setError(response?.error?.message);
      evtSource.close();
    } else if (response && response.auth?.modes) {
      // console.log('Auth mode response', JSON.stringify(response));
      setAvailableVerificationOptions(response.auth?.modes || []);
      evtSource.close();
    } else if (response && response.auth?.transactionId) {
      // console.log('generate otp response', JSON.stringify(response));
      setTransactionId(response.auth?.transactionId || '');
      evtSource.close();
    } else if (response && response.auth?.patient) {
      // console.log(response.auth.patient);
      setPatient(response.auth.patient);
    }
  };

  const handleOnClick = async () => {
    handleReset();
    const reqId = await authModeForAbhaAddressVerification({ abhaAddress: patientIdentifier.identifierValue });
    // console.log(reqId);
    setRequestId(reqId);
  };

  const handleGenerateMobileOtp = async () => {
    const reqId = await generateMobileOTPForAbhaAddressVerification({ abhaAddress: patientIdentifier.identifierValue });
    // console.log(reqId);
    setOtpGenerated(true);
    setResendOtp(false);
    setTimeout(() => {
      setResendOtp(true);
    }, 60000);
    setRequestId(reqId);
  };

  const handleVerifyOtp = async () => {
    const reqId = await verifyMobileOTPForAbhaAddressVerification({ otp, transactionId });
    // console.log(reqId);
    setRequestId(reqId);
  };

  const handleReset = async () => {
    setRequestId('');
    setPatient('');
    setOtp('');
    setAvailableVerificationOptions([]);
    setError('');
    setOtpGenerated(false);
    setTransactionId('');
    evtSource.close();
  };

  const getGender = (acronym: string) => {
    switch (acronym) {
      case 'M':
        return 'Male';
      case 'F':
        return 'Female';
      case 'O':
        return 'Other';
      case 'U':
        return 'Unknown';
      default:
        return 'Unknown';
    }
  };

  return (
    <div>
      {!patient.id && (
        <div>
          <Button onClick={handleOnClick} disabled={!patientIdentifier.identifierValue}>
            Verify address
          </Button>
          <Button onClick={handleReset} style={{ margin: '0px 5px' }}>
            Reset
          </Button>
        </div>
      )}
      {!patient.id && availableVerificationOptions?.includes('MOBILE_OTP') && (
        <Button onClick={handleGenerateMobileOtp} disabled={otpGenerated} style={{ margin: '10px 0px' }}>
          Send OTP
        </Button>
      )}
      {!patient.id && otpGenerated && (
        <div>
          <TextInput
            id={'OTP'}
            labelText={'OTP'}
            value={otp}
            required={true}
            placeHolder={'Enter otp'}
            onChange={(e) => {
              if (!isNaN(e.target.value)) {
                setOtp(e.target.value);
              }
            }}
          />
          <div style={{ display: 'flex' }}>
            <Button onClick={handleVerifyOtp} style={{ margin: '10px 0px' }}>
              Verify Otp
            </Button>
            <Button onClick={handleGenerateMobileOtp} style={{ margin: '10px 5px' }} disabled={!resendOtp}>
              Resend Otp
            </Button>
          </div>
        </div>
      )}
      <div style={{ color: 'red' }}>{error}</div>
      {/* {requestId}
            {transactionId} */}
      {/* patient.id && patient.id === patientIdentifier.identifierValue */}
      {patient.id && patient.id === patientIdentifier.identifierValue && (
        <div>
          <div style={{ color: 'green' }}>Id verified</div>
          <div style={{ margin: '10px 0px' }}>
            <div style={{ fontSize: '17px' }}>User details</div>
            <div>
              <div>Name: {patient.name}</div>
              <div>Gender: {patient.gender}</div>
              <div>
                DOB: {patient.dayOfBirth}/{patient.monthOfBirth}/{patient.yearOfBirth}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AbhaId;
