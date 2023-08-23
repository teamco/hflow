import React from 'react';
import { Tag } from 'antd';
import { NavLink } from '@umijs/max';

import { COLORS } from '@/utils/colors';

import tableStyles from '@/components/Main/Table/table.module.less';
import { plural } from 'pluralize';

/**
 * @export
 * @param assignedTo
 * @return {JSX.Element}
 */
export const handleAssignedTo = (assignedTo = []) => {
  return (
      <div className={tableStyles.tags}>
        {assignedTo.map(({ model, type, modelByRef }, idx) => (
            <Tag key={idx} color={COLORS.tags.geekblue}>
              <NavLink to={`/admin/${plural(model.toLowerCase())}/${modelByRef}`}>
                {`${model} [${type}]`}
              </NavLink>
            </Tag>
        ))}
      </div>
  );
};

/**
 * @export
 * @param weekly
 * @return {JSX.Element}
 */
export const handleWeekly = (weekly) => {
  return (
      <div className={tableStyles.tags}>
        {weekly?.days.map((day, idx) => (
            <Tag key={idx} color={COLORS.tags.volcano}>
              {day}
            </Tag>
        ))}
      </div>
  );
};

/**
 * @export
 * @param monthly
 * @param weekly
 * @return {JSX.Element}
 */
export const handleMonthly = (monthly, weekly) => {
  if (monthly?.type === 'Period') {
    return (
        <div className={tableStyles.tags}>
          {weekly?.days.map((day, idx) => (
              <Tag key={idx} color={COLORS.tags.cyan}>
                {`${monthly.weekDay} ${day}`}
              </Tag>
          ))}
        </div>
    );
  } else if (monthly?.type === 'Day') {
    return (
        <div className={tableStyles.tags}>
          <Tag key={'monthDay'} color={COLORS.tags.gold}>
            {monthly?.monthDay}
          </Tag>
        </div>
    );
  }
};

/**
 * @export
 * @param yearly
 * @param monthly
 * @param weekly
 * @return {JSX.Element}
 */
export const handleYearly = (yearly, monthly, weekly) => {
  return (
      <>
        {handleMonthly(monthly, weekly)}
        <div className={tableStyles.tags}>
          {yearly?.months.map((month, idx) => (
              <Tag key={idx} color={COLORS.tags.magenta}>
                {month}
              </Tag>
          ))}
        </div>
      </>
  );
};
