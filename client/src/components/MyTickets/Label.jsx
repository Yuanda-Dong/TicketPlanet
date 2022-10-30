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
alpha(themeColors.white, 0.02);
alpha(themeColors.white, 0.1);
alpha(themeColors.white, 0.3);
alpha(themeColors.white, 0.5);
alpha(themeColors.white, 0.7);
alpha(themeColors.white, 0.02);
alpha(themeColors.white, 0.1);
alpha(themeColors.white, 0.3);
alpha(themeColors.white, 0.5);
alpha(themeColors.white, 0.7);
alpha(themeColors.black, 0.02);
alpha(themeColors.black, 0.1);
alpha(themeColors.black, 0.3);
alpha(themeColors.black, 0.5);
alpha(themeColors.black, 0.7);

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
