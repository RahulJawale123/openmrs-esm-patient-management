import { registerBreadcrumbs, defineConfigSchema, getAsyncLifecycle } from '@openmrs/esm-framework';
import { esmPatientRegistrationSchema } from './config-schema';
import { moduleName, patientRegistration } from './constants';
import { setupOffline } from './offline';

export const importTranslation = require.context('../translations', false, /.json$/, 'lazy');

const options = {
  featureName: 'Patient Registration',
  moduleName,
};

export function startupApp() {
  defineConfigSchema(moduleName, esmPatientRegistrationSchema);

  registerBreadcrumbs([
    {
      path: `${window.spaBase}/${patientRegistration}`,
      // t('patientRegistrationBreadcrumb', 'Patient Registration')
      title: () =>
        Promise.resolve(
          window.i18next.t('patientRegistrationBreadcrumb', { defaultValue: 'Patient Registration', ns: moduleName }),
        ),
      parent: `${window.spaBase}/home`,
    },
    {
      path: `${window.spaBase}/patient/:patientUuid/edit`,
      // t('editPatientDetailsBreadcrumb', 'Edit patient details')
      title: () =>
        Promise.resolve(
          window.i18next.t('editPatientDetailsBreadcrumb', { defaultValue: 'Edit patient details', ns: moduleName }),
        ),
      parent: `${window.spaBase}/patient/:patientUuid/chart`,
    },
  ]);

  setupOffline();
}

export const root = getAsyncLifecycle(() => import('./root.component'), options);

export const editPatient = getAsyncLifecycle(() => import('./root.component'), {
  featureName: 'edit-patient-details-form',
  moduleName,
});

export const addPatientLink = getAsyncLifecycle(() => import('./add-patient-link'), options);

export const cancelPatientEditModal = getAsyncLifecycle(
  () => import('./widgets/cancel-patient-edit.component'),
  options,
);

export const patientPhoto = getAsyncLifecycle(() => import('./widgets/display-photo.component'), options);

export const editPatientDetailsButton = getAsyncLifecycle(
  () => import('./widgets/edit-patient-details-button.component'),
  {
    featureName: 'edit-patient-details',
    moduleName,
  },
);

export const deleteIdentifierConfirmationModal = getAsyncLifecycle(
  () => import('./widgets/delete-identifier-confirmation-modal'),
  options,
);
