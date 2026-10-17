import React from 'react';
import { ComponentStory, Meta} from "@storybook/react";
import { Banner } from './Banner';

export default{
    title: "Neakhatka/Organisms/Banner",
    component: Banner,parameters: {
        design: {
          type: "figma",
          url: "",
        },
      },
      tags: ["autodocs"],
    } as Meta;
    const Template: ComponentStory<typeof Banner> = (args) => <Banner {...args} />;

    export const Default = Template.bind({});
    Default.args = {};

