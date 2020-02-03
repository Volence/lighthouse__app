import React from 'react';
import AdminCommands from './AdminCommands';
import { Divider } from '@material-ui/core';
import MapTypeList from './MapTypeList';
import PageTypeList from './PageTypeList';
import { makeStyles } from '@material-ui/core/styles';
import GoogleLogin, { GoogleLogout } from 'react-google-login';
import { sendSignInMutation } from '../utils';
import Cookies from 'js-cookie';
import { signIn } from '../gql/queries';

const useStyles = makeStyles(theme => ({
    toolbar: theme.mixins.toolbar,
    google: {
        marginTop: 'auto',
    },
}));

const DrawerContents = ({
    setChartNumber,
    currentSelectedSite,
    setDisplayType,
    setCurrentSiteDisplayed,
    setDisplayData,
    userType,
    setUserType,
    isLoggedIn,
    setIsLoggedIn,
    sites,
}) => {
    const classes = useStyles();
    const login = async googleResponse => {
        const userData = {
            userName: googleResponse.profileObj.name,
            email: googleResponse.profileObj.email,
            clientToken: googleResponse.tokenId,
            userID: googleResponse.googleId,
        };
        const response = await sendSignInMutation(signIn, userData);
        if (response.data.signIn.error !== null) {
            alert('Error, please try to sign in at a later time!');
            return;
        }
        Cookies.set('loggedIn', true, 7);
        Cookies.set('userID', response.data.signIn.userID, 7);
        Cookies.set('userType', response.data.signIn.userType, 7);
        setUserType(response.data.signIn.userType);
        setIsLoggedIn(true);
    };
    const failLogin = googleResponse => {
        if (googleResponse.error === 'idpiframe_initialization_failed') {
            return;
        }
        alert(`Error, please try to sign in at a later time! 
        ${googleResponse.details}`);
    };
    const logout = () => {
        Cookies.set('loggedIn', false);
        Cookies.set('userID', '');
        Cookies.set('userType', 'Basic');
        setUserType('Basic');
        setIsLoggedIn(false);
    };

    return (
        <>
            <div className={classes.toolbar} />
            <Divider />
            <PageTypeList isDisabled={currentSelectedSite === 'Select Site' ? true : false} setChartNumber={setChartNumber} />
            <Divider />
            <MapTypeList
                isDisabled={currentSelectedSite === 'Select Site' ? true : false}
                setDisplayType={setDisplayType}
                setCurrentSiteDisplayed={setCurrentSiteDisplayed}
                currentSelectedSite={currentSelectedSite}
                setDisplayData={setDisplayData}
            />
            <Divider />
            <AdminCommands userType={userType} sites={sites} />

            {isLoggedIn || (
                <GoogleLogin
                    clientId={process.env.REACT_APP_CLIENT_ID}
                    buttonText="Login"
                    className={classes.google}
                    onSuccess={login}
                    onFailure={failLogin}
                    cookiePolicy={'single_host_origin'}
                />
            )}
            {isLoggedIn && <GoogleLogout clientId={process.env.REACT_APP_CLIENT_ID} className={classes.google} buttonText="Logout" onLogoutSuccess={logout} />}
        </>
    );
};

export default DrawerContents;
