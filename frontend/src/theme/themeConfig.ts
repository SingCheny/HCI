import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#B88A72',
    colorPrimaryHover: '#A67862',
    colorPrimaryActive: '#9A6D58',

    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',

    colorText: '#4C4038',
    colorTextSecondary: '#7A6A60',
    colorTextTertiary: '#A08F84',
    colorTextQuaternary: '#A08F84',

    colorBgContainer: '#FFFDF9',
    colorBgLayout: '#F8F4EF',
    colorBgElevated: '#FFFDF9',

    colorBorder: '#E2D4C7',
    colorBorderSecondary: '#F1E7DC',

    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    boxShadow: '0 1px 3px rgba(76, 64, 56, 0.06)',
    boxShadowSecondary: '0 4px 16px rgba(76, 64, 56, 0.06)',
  },
  components: {
    Button: {
      primaryColor: '#FFFDF9',
      colorPrimary: '#B88A72',
      algorithm: true,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#B88A72',
      itemSelectedColor: '#FFFDF9',
      itemColor: '#7A6A60',
      itemHoverColor: '#4C4038',
      itemHoverBg: '#F1E7DC',
      activeBarBorderWidth: 0,
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 24,
      colorBgContainer: '#FFFDF9',
    },
    Layout: {
      siderBg: '#FFFDF9',
      headerBg: '#FFFDF9',
      bodyBg: '#F8F4EF',
    },
    Progress: {
      defaultColor: '#B88A72',
    },
    Input: {
      colorBgContainer: '#F8F4EF',
      activeBorderColor: '#B88A72',
      hoverBorderColor: '#E2D4C7',
    },
    Select: {
      colorBgContainer: '#F8F4EF',
    },
  },
};

export default themeConfig;
