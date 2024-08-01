import React from 'react';
import { useParams } from 'react-router-dom';
import { getThread, updateTicketPriority, updateTicketStatus } from './api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Message } from './models/user.model';
import { Box, Button, ButtonGroup, Card, Divider, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, Typography } from '@mui/material';


const TicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    if (!id) {
        return <div>No ticket id</div>;
    }
    const ticketsQuery = useQuery({ queryKey: ['thread', id], queryFn: () => getThread(id) });

    const statusMutatun = useMutation({ mutationFn: updateTicketStatus, onSuccess: () => ticketsQuery.refetch() });
    const priorityMutation = useMutation({ mutationFn: updateTicketPriority, onSuccess: () => ticketsQuery.refetch() });

    if (!ticketsQuery.data) {
        return <div>Ticket not found</div>;
    }

    const statusOptions = [
        { value: 'Open', label: 'Open' },
        { value: 'Closed', label: 'Closed' },
        { value: 'Not Started', label: 'Not Started' },
    ]

    const handleStatusUpdate = (event: SelectChangeEvent) => {
        statusMutatun.mutate({ ticketId: parseInt(id), status: event.target.value });
    };
    const handlePriorityUpdate = (value: number) => {
        priorityMutation.mutate({ ticketId: parseInt(id), priority: value });
    }

    return (
        <div>
            <Typography variant="h4">Ticket Detail</Typography>
            <Stack spacing={2} direction="column">
                <DisplayField label="Title" value={ticketsQuery.data.ticket.title} />
                <StatusDropdown label="Status" value={ticketsQuery.data.ticket.status} onChange={handleStatusUpdate} options={statusOptions} />
                <PriorityButtonGroup value={ticketsQuery.data.ticket.priority} onChange={handlePriorityUpdate} />
            </Stack>
            <Stack spacing={2}>
                {ticketsQuery.data.messages.map((message: Message) => (
                    <div key={message.id}>
                        <MessageDetail message={message} />
                        <Divider />
                    </div>
                ))}
            </Stack>
        </div>
    );
};



interface DisplayFieldProps {
    label: string;
    value: string | number;
}

const DisplayField: React.FC<DisplayFieldProps> = ({ label, value }) => {
    return (
        <Box mb={2}>
            <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" color="textSecondary">
                    {label}:
                </Typography>
                <Typography variant="body1">
                    {value}
                </Typography>
            </Stack>
        </Box>
    );
};

interface MessageProps {
    message: Message;
}

const MessageDetail: React.FC<MessageProps> = ({ message }) => {
    const body = { __html: message.body || '' };
    return (
        <Card key={message.id}>
            <div dangerouslySetInnerHTML={body}></div>
        </Card>
    );
}

export default TicketDetail;

interface StatusDropdownProps {
    label: string;
    value: string;
    onChange: (event: SelectChangeEvent) => void;
    options: { value: string; label: string }[];
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ label, value, onChange, options }) => {
    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};


interface PriorityButtonGroupProps {
    value: number;
    onChange: (value: number) => void;
}

const PriorityButtonGroup: React.FC<PriorityButtonGroupProps> = ({ value, onChange }) => {
    console.log(value);
    return (
        <ButtonGroup>
            <Button
                variant={value === 0 ? 'contained' : 'outlined'}
                onClick={() => onChange(0)}
            >
                Low
            </Button>
            <Button
                variant={value === 1 ? 'contained' : 'outlined'}
                onClick={() => onChange(1)}
            >
                Medium
            </Button>
            <Button
                variant={value === 2 ? 'contained' : 'outlined'}

                onClick={() => onChange(2)}
            >
                High
            </Button>
        </ButtonGroup>
    );
};

