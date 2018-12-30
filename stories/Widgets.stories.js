import React from 'react';
import {storiesOf} from "@storybook/react";
import {withKnobs, text, boolean, number, color} from '@storybook/addon-knobs';
import { actions } from '@storybook/addon-actions';

import Line from "rc-progress/es/Line";

const stories = storiesOf('Widgets', module);

// https://github.com/storybooks/storybook/tree/next/addons/knobs
// Add the `withKnobs` decorator to add knobs support to your stories.
// You can also configure `withKnobs` as a global decorator.
stories.addDecorator(withKnobs);

// https://github.com/storybooks/storybook/tree/next/addons/actions
const eventsFromNames = actions('onClick');
const eventsFromObject = actions({ onMouseOver: 'hovered' });

// ====== Stories ======

stories.add('ProgressBar', () => {
  const percentValue = number('percent', 50);
  const trailWidthValue = number('trailWidth', 1);
  const strokeWidthValue = number('strokeWidth', 2);
  const trailColorlabel = 'trailColor';
  const strokeColorLabel = 'strokeColor';
  const blueValue = '#1130FF';
  const grayValue = 'gray';
  const strokeColorValue = color(strokeColorLabel, blueValue);
  const trailColorValue = color(trailColorlabel, grayValue);

  return <Line
    percent={percentValue}
    trailColor={trailColorValue}
    trailWidth={trailWidthValue}
    strokeWidth={strokeWidthValue}
    strokeColor={strokeColorValue}
    {...eventsFromNames}
    {...eventsFromObject}
  />
}, {
  notes: 'Progress bar example',
});
