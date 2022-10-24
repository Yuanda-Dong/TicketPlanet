import {styled} from '@mui/material/styles';
import {alpha, Box, Container} from "@mui/material";

const PageTitle = styled(Box)(
	({theme}) => `
        padding: ${theme.spacing(4)};
`
);

export const PageTitleWrapper = ({children}) => {
	return (
		<PageTitle className="MuiPageTitle-wrapper">
			<Container maxWidth="lg">{children}</Container>
		</PageTitle>
	);
};

const themeColors = {
	primary: '#5569ff',
	secondary: '#6E759F',
	success: '#57CA22',
	warning: '#FFA319',
	error: '#FF1943',
	info: '#33C2FF',
	black: '#223354',
	white: '#ffffff',
	primaryAlt: '#000C57'
};

const colors = {
	gradients: {
		blue1: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
		blue2: 'linear-gradient(135deg, #ABDCFF 0%, #0396FF 100%)',
		blue3: 'linear-gradient(127.55deg, #141E30 3.73%, #243B55 92.26%)',
		blue4: 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)',
		blue5: 'linear-gradient(135deg, #97ABFF 10%, #123597 100%)',
		orange1: 'linear-gradient(135deg, #FCCF31 0%, #F55555 100%)',
		orange2: 'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)',
		orange3: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
		purple1: 'linear-gradient(135deg, #43CBFF 0%, #9708CC 100%)',
		purple3: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		pink1: 'linear-gradient(135deg, #F6CEEC 0%, #D939CD 100%)',
		pink2: 'linear-gradient(135deg, #F761A1 0%, #8C1BAB 100%)',
		green1: 'linear-gradient(135deg, #FFF720 0%, #3CD500 100%)',
		green2: 'linear-gradient(to bottom, #00b09b, #96c93d)',
		black1: 'linear-gradient(100.66deg, #434343 6.56%, #000000 93.57%)',
		black2: 'linear-gradient(60deg, #29323c 0%, #485563 100%)'
	},
	shadows: {
		success:
			'0px 1px 4px rgba(68, 214, 0, 0.25), 0px 3px 12px 2px rgba(68, 214, 0, 0.35)',
		error:
			'0px 1px 4px rgba(255, 25, 67, 0.25), 0px 3px 12px 2px rgba(255, 25, 67, 0.35)',
		info: '0px 1px 4px rgba(51, 194, 255, 0.25), 0px 3px 12px 2px rgba(51, 194, 255, 0.35)',
		primary:
			'0px 1px 4px rgba(85, 105, 255, 0.25), 0px 3px 12px 2px rgba(85, 105, 255, 0.35)',
		warning:
			'0px 1px 4px rgba(255, 163, 25, 0.25), 0px 3px 12px 2px rgba(255, 163, 25, 0.35)',
		card: '0px 9px 16px rgba(159, 162, 191, .18), 0px 2px 2px rgba(159, 162, 191, 0.32)',
		cardSm:
			'0px 2px 3px rgba(159, 162, 191, .18), 0px 1px 1px rgba(159, 162, 191, 0.32)',
		cardLg:
			'0 5rem 14rem 0 rgb(255 255 255 / 30%), 0 0.8rem 2.3rem rgb(0 0 0 / 60%), 0 0.2rem 0.3rem rgb(0 0 0 / 45%)'
	},
	layout: {
		general: {
			bodyBg: '#f2f5f9'
		},
	},
	alpha: {
		white: {
			5: alpha(themeColors.white, 0.02),
			10: alpha(themeColors.white, 0.1),
			30: alpha(themeColors.white, 0.3),
			50: alpha(themeColors.white, 0.5),
			70: alpha(themeColors.white, 0.7),
			100: themeColors.white
		},
		trueWhite: {
			5: alpha(themeColors.white, 0.02),
			10: alpha(themeColors.white, 0.1),
			30: alpha(themeColors.white, 0.3),
			50: alpha(themeColors.white, 0.5),
			70: alpha(themeColors.white, 0.7),
			100: themeColors.white
		},
		black: {
			5: alpha(themeColors.black, 0.02),
			10: alpha(themeColors.black, 0.1),
			30: alpha(themeColors.black, 0.3),
			50: alpha(themeColors.black, 0.5),
			70: alpha(themeColors.black, 0.7),
			100: themeColors.black
		}
	},
	secondary: {
		main: themeColors.secondary,
	},
	primary: {
		main: themeColors.primary,
	},
	success: {
		main: themeColors.success,
	},
	warning: {
		main: themeColors.warning,
	},
	error: {
		main: themeColors.error,
	},
	info: {
		main: themeColors.info,
	}
};

const LabelWrapper = styled('span')(
	({theme}) => `
      background-color: ${alpha(themeColors.black, 0.02)};
      padding: ${theme.spacing(0.5, 1)};
      font-size: ${theme.typography.pxToRem(13)};
      border-radius: '10px';
      display: inline-flex;
      align-items: center;
      justify-content: center;
      max-height: ${theme.spacing(3)};
      
      &.MuiLabel {
        &-secondary {
          background-color: ${alpha(themeColors.secondary, 0.1)};
          color: ${themeColors.secondary}
        }
        
        &-success {
          background-color: ${alpha(themeColors.success, 0.1)};
          color: ${themeColors.success}
        }
        
        &-warning {
          background-color: ${alpha(themeColors.warning, 0.1)};
          color: ${themeColors.warning}
        }
              
        &-error {
          background-color: ${alpha(themeColors.error, 0.1)};
          color: ${themeColors.error}
        }
      }
`
);

export const Label = ({className, color = 'secondary', children}) => {
	return (
		<LabelWrapper className={'MuiLabel-' + color}>
			{children}
		</LabelWrapper>
	);
};


export default {PageTitleWrapper, Label};
