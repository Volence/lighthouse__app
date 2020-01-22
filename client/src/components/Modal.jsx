import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import { Button, ListItem, ListItemText, TextField } from '@material-ui/core';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import { sendMutation } from '../utils';
import * as customQueries from '../gql/queries';

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: '#fff',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(7, 10),
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

    const AddSiteForm = styled.form`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 4rem;
    `;

    return (
        <div>
            <ListItem button key={'Add Site'} onClick={handleOpen}>
                <ListItemText primary={'Add Site'} />
            </ListItem>
            <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2>Add a site:</h2>
                        <AddSiteForm onSubmit={e => submitNewSite(e)}>
                            <TextField
                                label="Site Name:"
                                type="text"
                                placeholder="esslinger"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={siteCreationFormValues.siteName}
                                onChange={e => updateSiteCreationFormValues(e, 'siteName')}
                            ></TextField>
                            <TextField
                                type="text"
                                label="Main URL:"
                                placeholder="https://www.esslinger.com/"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={siteCreationFormValues.mainURL}
                                onChange={e => updateSiteCreationFormValues(e, 'mainURL')}
                            ></TextField>
                            <TextField
                                type="text"
                                label="Category URL:"
                                placeholder="https://www.esslinger.com/watch-parts/"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={siteCreationFormValues.categoryURL}
                                onChange={e => updateSiteCreationFormValues(e, 'categoryURL')}
                            ></TextField>
                            <TextField
                                type="text"
                                label="Product URL:"
                                placeholder="https://www.esslinger.com/watch-battery-energizer-377-and-376-replacement-cell/"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={siteCreationFormValues.productURL}
                                onChange={e => updateSiteCreationFormValues(e, 'productURL')}
                            ></TextField>
                            <Button variant="contained" color="primary" type="submit">
                                Add Site
                            </Button>
                        </AddSiteForm>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
