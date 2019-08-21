import React from 'react';
import OpCard from '../components/Op/OpCard.js'
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

storiesOf('Buttons', module)
.add('with text', () => <OpCard />)