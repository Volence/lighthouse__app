import React from 'react';
import { Drawer, Hidden } from '@material-ui/core';
import DrawerContents from './DrawerContents';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth - 80,
        },
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
        },
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth - 80,
        },
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
        },
    },
}));

const SideBar = ({
    handleDrawerToggle,
    mobileDrawerOpen,
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
    const drawerContents = (
        <DrawerContents
            sites={sites}
            setChartNumber={setChartNumber}
            currentSelectedSite={currentSelectedSite}
            setDisplayType={setDisplayType}
            setCurrentSiteDisplayed={setCurrentSiteDisplayed}
            setDisplayData={setDisplayData}
            userType={userType}
            setUserType={setUserType}
            isLoggedIn={isLoggedIn}
            setIsLoggedIn={setIsLoggedIn}
        />
    );
    return (
        <>
            <Hidden smUp implementation="css">
                <Drawer
                    onClose={handleDrawerToggle}
                    className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                    variant="temporary"
                    open={mobileDrawerOpen}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >
                    {drawerContents}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    onClose={handleDrawerToggle}
                    className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                    variant="permanent"
                    open
                >
                    {drawerContents}
                </Drawer>
            </Hidden>
        </>
    );
};

export default SideBar;
