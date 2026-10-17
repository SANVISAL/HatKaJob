import { expect } from '@storybook/jest';
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Nav } from './Nav'; 
import { action } from '@storybook/addon-actions';
import { screen } from '@storybook/testing-library';
import { userEvent, within } from '@storybook/testing-library';

export default {
  title: 'Neakhatka/Organisms/Nav',
  component: Nav,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/proto/Cvvmjfhl1K2c8EkXBRK3OF/Neakhatka?node-id=1238-144&m=dev&scaling=min-zoom&page-id=1238%3A37&starting-point-node-id=1238%3A144&t=FcTp0rvbS5CJmdaR-1',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onMenuToggle: { action: "Menu Toggled" },
    onLinkClick: { action: "Link Clicked" }
  }
} as ComponentMeta<typeof Nav>;

const Template: ComponentStory<typeof Nav> = (args) => <Nav />;

export const Default = Template.bind({});
Default.args = {
  isMenuOpen: false,
  activeLink: '/',
  count: 0,
};



export const WithCount = Template.bind({});
WithCount.args = {
  isMenuOpen: false,
  activeLink: '/favorite',
  count: 5,
};




