import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ContentSwitcher, Switch } from '@carbon/react';
import { ArrowRight, Filter, ArrowLeft } from '@carbon/react/icons';
import { navigate } from '@openmrs/esm-framework';
import { spaBasePath } from '../../constants';
import type { CalendarType } from '../../types';
import styles from './calendar-header.scss';

enum CalendarView {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

interface CalendarHeaderProps {
  onChangeView: (view: CalendarView) => void;
  calendarView: CalendarType;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ onChangeView, calendarView }) => {
  const { t } = useTranslation();
  const backButtonOnClick = () => {
    navigate({ to: `${spaBasePath}/appointments` });
  };
  const addNewClinicDayOnClick = () => {
    // add new clinic day functionality
  };
  const filterOnClick = () => {
    // filter functionality
  };

  const calendarViewObject = {
    daily: CalendarView.Daily,
    weekly: CalendarView.Weekly,
    monthly: CalendarView.Monthly,
  };

  return (
    <div className={styles.calendarHeaderContainer}>
      <div className={styles.titleContainer}>
        <div className={styles.backButton}>
          <Button
            kind="ghost"
            onClick={backButtonOnClick}
            renderIcon={ArrowLeft}
            iconDescription={t('back', 'Back')}
            size="lg">
            <span>{t('back', 'Back')}</span>
          </Button>
        </div>
        <p>{t('calendar', 'Calendar')}</p>
        <Button size="md" kind="ghost" renderIcon={ArrowRight} onClick={addNewClinicDayOnClick}>
          {t('addNewClinicDay', 'Add new clinic day')}
        </Button>
      </div>
      <div className={styles.titleContent}>
        <Button size="md" renderIcon={Filter} kind="ghost" onClick={filterOnClick}>
          {t('filter', 'Filter')}
        </Button>
        <ContentSwitcher
          selectedIndex={2}
          size="md"
          style={{ maxWidth: '30rem' }}
          onChange={({ name }) => onChangeView(name as CalendarView)}>
          <Switch name={CalendarView.Daily} text={t('daily', 'Daily')} />
          <Switch name={CalendarView.Weekly} text={t('weekly', 'Weekly')} />
          <Switch name={CalendarView.Monthly} text={t('monthly', 'Monthly')} />
        </ContentSwitcher>
      </div>
    </div>
  );
};

export default CalendarHeader;
