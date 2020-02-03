import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText, TextField, Tooltip } from '@material-ui/core';
import { sendMutation } from '../utils';
import { createSite } from '../gql/queries';

const useStyles = makeStyles(theme => ({
    dialogContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

const CreateSiteForm = ({ open, setOpen, handleOpen, handleClose, name, tooltip }) => {
    const classes = useStyles();
    const [siteCreationFormValues, setSiteCreationFormValues] = useState({ siteName: '', mainURL: '', categoryURL: '', productURL: '' });

    const submitNewSite = async event => {
        try {
            event.preventDefault();
            await sendMutation(createSite, siteCreationFormValues);
            setOpen(false);
        } catch (err) {
            setOpen(false);
            console.log(err);
        }
    };

    const updateSiteCreationFormValues = (event, propertyName) => {
        event.preventDefault();
        setSiteCreationFormValues({ ...siteCreationFormValues, [propertyName]: event.target.value });
    };
    return (
        <>
            <Tooltip title={tooltip}>
                <ListItem button key={name} onClick={handleOpen}>
                    <ListItemText primary={name} />
                </ListItem>
            </Tooltip>
            <Dialog maxWidth={'sm'} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a site:</DialogTitle>
                <DialogContent className={classes.dialogContainer}>
                    <TextField
                        label="Site Name:"
                        type="text"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.siteName}
                        onChange={e => updateSiteCreationFormValues(e, 'siteName')}
                    ></TextField>
                    <TextField
                        type="text"
                        label="Main URL:"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.mainURL}
                        onChange={e => updateSiteCreationFormValues(e, 'mainURL')}
                    ></TextField>
                    <TextField
                        type="text"
                        label="Category URL:"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.categoryURL}
                        onChange={e => updateSiteCreationFormValues(e, 'categoryURL')}
                    ></TextField>
                    <TextField
                        type="text"
                        label="Product URL:"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.productURL}
                        onChange={e => updateSiteCreationFormValues(e, 'productURL')}
                    ></TextField>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={submitNewSite} color="primary">
                            Add Site
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateSiteForm;
