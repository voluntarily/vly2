import { create } from '@storybook/theming';
import logo from "../public/static/vComponentLibrary.png";
export default create({
  base: 'light',

  colorPrimary: 'purple',
  colorSecondary: '#6549AA',


  // Typography
  fontBase: '"Inter", sans-serif',
  fontCode: 'monospace',



  brandTitle: 'Voluntarily Component Library',
  brandUrl: 'https://example.com',
  brandImage: logo,
});