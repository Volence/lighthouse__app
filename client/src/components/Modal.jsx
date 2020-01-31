import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, ListItem, ListItemText, TextField } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { sendMutation } from '../utils';
import * as customQueries from '../gql/queries';

const useStyles = makeStyles(theme => ({
    dialogContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
    const { in: open, children, onEnter, onExited, ...other } = props;
    const style = useSpring({
        from: { opacity: 0 },
        to: { opacity: open ? 1 : 0 },
        onStart: () => {
            if (open && onEnter) {
                onEnter();
            }
        },
        onRest: () => {
            if (!open && onExited) {
                onExited();
            }
        },
    });

    return (
        <animated.div ref={ref} style={style} {...other}>
            {children}
        </animated.div>
    );
});

Fade.propTypes = {
    children: PropTypes.element,
    in: PropTypes.bool.isRequired,
    onEnter: PropTypes.func,
    onExited: PropTypes.func,
};

export default function SpringModal() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [siteCreationFormValues, setSiteCreationFormValues] = useState({ siteName: '', mainURL: '', categoryURL: '', productURL: '' });

    const submitNewSite = async event => {
        try {
            event.preventDefault();
            let response = sendMutation(customQueries.createSite, siteCreationFormValues);
            console.log('response ', response);
        } catch (err) {
            console.log(err);
        }
    };

    const updateSiteCreationFormValues = (event, propertyName) => {
        event.preventDefault();
        setSiteCreationFormValues({ ...siteCreationFormValues, [propertyName]: event.target.value });
    };

    return (
        <div>
            <ListItem button key={'Add Site'} onClick={handleOpen}>
                <ListItemText primary={'Add Site'} />
            </ListItem>
            <Dialog maxWidth={'sm'} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add a site:</DialogTitle>
                <DialogContent className={classes.dialogContainer} onSubmit={e => submitNewSite(e)}>
                    <TextField
                        label="Site Name:"
                        type="text"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.siteName}
                        onChange={e => updateSiteCreationFormValues(e, 'siteName')}
                    ></TextField>
                    <TextField
                        type="text"
                        label="Main URL:"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.mainURL}
                        onChange={e => updateSiteCreationFormValues(e, 'mainURL')}
                    ></TextField>
                    <TextField
                        type="text"
                        label="Category URL:"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={siteCreationFormValues.categoryURL}
                        onChange={e => updateSiteCreationFormValues(e, 'categoryURL')}
                    ></TextField>
                    <TextField
                        type="text"
                        label="Product URL:"
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
        </div>
    );
}
