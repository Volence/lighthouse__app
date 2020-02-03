import React, { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText, TextField, Tooltip } from '@material-ui/core';
import { getUsers, addAdmin, removeAdmin } from '../gql/queries';

const useStyles = makeStyles(theme => ({
    dialogContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

const EditUserPermissionsForm = ({ name, handleOpen, open, handleClose, tooltip }) => {
    const classes = useStyles();
    const [userSelected, setUserSelected] = useState('Please Select a User');
    const [disableButtonsAdd, setDisableButtonsAdd] = useState(true);
    const [disableButtonsRemove, setDisableButtonsRemove] = useState(true);
    const [emailSelected, setEmailSelected] = useState('test@test.com');

    const [userList, setUserList] = useState([{ userName: 'Loading...', email: 'Loading...', userType: 'Loading...' }]);

    const updateUserList = data => {
        setUserList(data.users);
    };

    const updateSelectedUser = (event, value) => {
        if (!value) return;
        if (value.userType === 'Basic') {
            setDisableButtonsAdd(false);
            setDisableButtonsRemove(true);
        } else if (value.userType === 'Admin') {
            setDisableButtonsAdd(true);
            setDisableButtonsRemove(false);
        } else {
            setDisableButtonsAdd(true);
            setDisableButtonsRemove(true);
        }
        setEmailSelected(value.email);
        setUserSelected(`Selected user ${value.userName} (${value.email}) who has ${value.userType} permissions`);
    };

    const [loadUserData] = useLazyQuery(getUsers, {
        onCompleted: updateUserList,
    });

    const [updateAddAdmin] = useMutation(addAdmin);
    const [updateRemoveAdmin] = useMutation(removeAdmin);

    useEffect(() => {
        (async () => await loadUserData())();
    }, [loadUserData]);

    return (
        <>
            <Tooltip title={tooltip}>
                <ListItem button key={name} onClick={handleOpen}>
                    <ListItemText primary={name} />
                </ListItem>
            </Tooltip>
            <Dialog maxWidth={'sm'} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{userSelected}</DialogTitle>
                <DialogContent className={classes.dialogContainer}>
                    <Autocomplete
                        onChange={updateSelectedUser}
                        groupBy={option => option.userType}
                        id="combo-box-demo"
                        options={userList ? userList.sort((a, b) => -b.email.localeCompare(a.email)) : userList}
                        getOptionLabel={option => option.email}
                        style={{ width: 300 }}
                        renderInput={params => <TextField {...params} label="Select a User" variant="outlined" fullWidth />}
                    />
                    <DialogActions>
                        <Button
                            onClick={async e => {
                                setUserSelected(`Updating user...`);
                                setDisableButtonsAdd(false);
                                setDisableButtonsRemove(false);
                                await updateAddAdmin({ variables: { email: emailSelected } });
                                await loadUserData();
                                setDisableButtonsAdd(true);
                                setDisableButtonsRemove(false);
                                setUserSelected(`Updated user to Admin Privileges!`);
                            }}
                            color="primary"
                            disabled={disableButtonsAdd}
                        >
                            Add As Admin
                        </Button>
                        <Button
                            onClick={async e => {
                                setUserSelected(`Updating user...`);
                                setDisableButtonsAdd(false);
                                setDisableButtonsRemove(false);
                                await updateRemoveAdmin({ variables: { email: emailSelected } });
                                await loadUserData();
                                setDisableButtonsAdd(false);
                                setDisableButtonsRemove(true);
                                setUserSelected(`Updated user to Basic Privileges!`);
                            }}
                            color="primary"
                            disabled={disableButtonsRemove}
                        >
                            Remove As Admin
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditUserPermissionsForm;
