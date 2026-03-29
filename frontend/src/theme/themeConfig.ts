import type { ThemeConfig } from 'antd';

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#292524',
    colorPrimaryHover: '#44403c',
    colorPrimaryActive: '#1c1917',

    colorSuccess: '#22c55e',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',

    colorText: '#1c1917',
    colorTextSecondary: '#57534e',
    colorTextTertiary: '#78716c',
    colorTextQuaternary: '#a8a29e',

    colorBgContainer: '#ffffff',
    colorBgLayout: '#fafafa',
    colorBgElevated: '#ffffff',

    colorBorder: 'rgba(0, 0, 0, 0.08)',
    colorBorderSecondary: 'rgba(0, 0, 0, 0.05)',

    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,

    controlHeight: 40,
    controlHeightLG: 48,
    controlHeightSM: 32,

    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
    boxShadowSecondary: '0 4px 16px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Button: {
      primaryColor: '#ffffff',
      colorPrimary: '#292524',
      algorithm: true,
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#292524',
      itemSelectedColor: '#ffffff',
      itemColor: '#78716c',
      itemHoverColor: '#292524',
      itemHoverBg: '#fafaf9',
      activeBarBorderWidth: 0,
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 24,
    },
    Layout: {
      siderBg: '#ffffff',
      headerBg: '#ffffff',
      bodyBg: '#fafafa',
    },
    Progress: {
      defaultColor: '#292524',
    },
    Input: {
      colorBgContainer: '#fafaf9',
      activeBorderColor: '#d6d3d1',
      hoverBorderColor: '#d6d3d1',
    },
    Select: {
      colorBgContainer: '#fafaf9',
    },
  },
};

export default themeConfig;
