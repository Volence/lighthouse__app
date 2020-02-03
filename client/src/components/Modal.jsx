import React, { useState } from 'react';
import CreateSiteForm from './CreateSiteForm';
import EditUserPermissionsForm from './EditUserPermissionsForm';
import RunAuditOnSitesModal from './RunAuditOnSitesModal';

const Modal = ({ modalType, sites, tooltip }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            {modalType === 'Add Site' && (
                <CreateSiteForm tooltip={tooltip} open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} name={modalType} />
            )}
            {modalType === 'Edit User Permissions' && (
                <EditUserPermissionsForm tooltip={tooltip} open={open} setOpen={setOpen} handleOpen={handleOpen} handleClose={handleClose} name={modalType} />
            )}
            {modalType === 'Run Data Collection' && (
                <RunAuditOnSitesModal
                    tooltip={tooltip}
                    open={open}
                    setOpen={setOpen}
                    handleOpen={handleOpen}
                    handleClose={handleClose}
                    name={modalType}
                    sites={sites}
                />
            )}
        </>
    );
};

export default Modal;
