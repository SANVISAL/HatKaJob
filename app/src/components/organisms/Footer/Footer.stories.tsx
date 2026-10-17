import React from 'react';
import { ComponentStory, Meta } from '@storybook/react';
import { Footer } from './Footer';

export default {
  title: 'Neakhatka/Organisms/Footer',
  component: Footer,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/proto/Cvvmjfhl1K2c8EkXBRK3OF/Neakhatka?node-id=1265-3070&m=dev&scaling=min-zoom&page-id=1265%3A3068&t=cYxBJpQt1vAtLAPC-1',
    },
  },
  tags: ['autodocs'],
} as Meta;

const Template: ComponentStory<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {
  
};
