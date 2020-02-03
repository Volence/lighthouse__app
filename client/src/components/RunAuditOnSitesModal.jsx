import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText, TextField, LinearProgress, Tooltip } from '@material-ui/core';
import { runSiteAudits } from '../gql/queries';

const useStyles = makeStyles(theme => ({
    dialogContainer: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '8rem',
    },
}));

const RunAuditOnSitesModal = ({ name, handleOpen, open, handleClose, sites, tooltip }) => {
    const classes = useStyles();
    const [sitesSelected, setSitesSelected] = useState([]);
    const [completedRun, setCompletedRun] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("Please select the sites you'd like to audit");
    const updateSitesSelected = (e, value) => {
        setSitesSelected(value.map(e => e.siteName));
    };
    const [runAllSitesMutation] = useMutation(runSiteAudits);
    const runAllSites = async () => {
        setLoading(true);
        setTitle(`Running Audits (this could take a few minutes)...`);
        await runAllSitesMutation();
        setTitle('Finished running audits on all sites!');
        setLoading(false);
        setCompletedRun(true);
    };

    const runSelectedSites = async () => {
        setLoading(true);
        setTitle(`Running Audits (this could take a few minutes)...`);
        await runAllSitesMutation(setSitesSelected);
        setTitle(`Finished running audits on sites: ${sitesSelected}`);
        setCompletedRun(true);
        setLoading(false);
    };

    return (
        <>
            <Tooltip title={tooltip}>
                <ListItem button key={name} onClick={handleOpen}>
                    <ListItemText primary={name} />
                </ListItem>
            </Tooltip>
            <Dialog maxWidth={'sm'} fullWidth open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{title}</DialogTitle>
                {loading ? (
                    <LinearProgress />
                ) : completedRun ? (
                    <Button onClick={handleClose} color="primary">
                        Ok
                    </Button>
                ) : (
                    <DialogContent className={classes.dialogContainer}>
                        <Autocomplete
                            multiple
                            onChange={updateSitesSelected}
                            groupBy={option => option.siteName[0].toUpperCase()}
                            getOptionLabel={option => option.siteName}
                            id="combo-box-demo"
                            options={sites ? sites.sort((a, b) => -b.siteName.localeCompare(a.siteName)) : sites}
                            style={{ width: 300 }}
                            renderInput={params => <TextField {...params} label="Select Sites" variant="outlined" fullWidth />}
                        />
                        <DialogActions>
                            {sitesSelected.length > 0 && (
                                <Button onClick={runSelectedSites} color="primary">
                                    Run On Selected Site
                                </Button>
                            )}
                            {sitesSelected.length < 1 && (
                                <Button onClick={runAllSites} color="primary">
                                    Run on All Sites
                                </Button>
                            )}
                        </DialogActions>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
};

export default RunAuditOnSitesModal;
