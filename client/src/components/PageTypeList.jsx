import React from 'react';
import { List, ListItem, ListItemText, Tooltip } from '@material-ui/core';

const pageToolTips = ['The Main Page', 'The Category Page', 'The Product Page'];

const PageTypeList = ({ setChartNumber, isDisabled }) => {
    return (
        <List>
            {['Main Page', 'Category Page', 'Product Page'].map((text, index) => (
                <Tooltip title={pageToolTips[index]}>
                    <ListItem button key={text} onClick={e => setChartNumber(index)} disabled={isDisabled}>
                        <ListItemText primary={text} />
                    </ListItem>
                </Tooltip>
            ))}
        </List>
    );
};

export default PageTypeList;
