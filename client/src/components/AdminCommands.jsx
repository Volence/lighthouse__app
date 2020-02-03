import React from 'react';
import { List } from '@material-ui/core';
import Modal from './Modal';

const addSiteToolTips = ['Add a new site to the database', 'Add or Remove User Permissions', 'Run Query On Sites'];

const AdminCommands = ({ userType, sites }) => {
    return (
        <>
            {(userType === 'Admin' || userType === 'Owner') && (
                <List>
                    {['Add Site', 'Edit User Permissions', 'Run Data Collection'].map((text, index) => (
                        <Modal tooltip={addSiteToolTips[index]} key={text} modalType={text} sites={sites}></Modal>
                    ))}
                </List>
            )}
        </>
    );
};

export default AdminCommands;
