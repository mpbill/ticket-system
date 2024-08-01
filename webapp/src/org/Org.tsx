import { useQuery } from "@tanstack/react-query";
import { getOrg, getTickets, triggerWorkflow } from "../api";
import CreateOrg from "./CreateOrg";
import { Button, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { OrganizationModel, TicketModel } from "../models/user.model";
import { FC } from "react";
import { useNavigate } from "react-router-dom";



function OrganizationPage() {
    const orgQuery = useQuery({ queryKey: ['org'], queryFn: getOrg, });
    const ticketsQuery = useQuery({ queryKey: ['tickets'], queryFn: getTickets });
    if (orgQuery.isLoading) {
        return <Typography>Loading...</Typography>
    }
    if (!orgQuery.data) {
        return <CreateOrg />
    }
    return (
        <div>
            <h1>Tickets</h1>
            <Typography variant="h4">Org: {orgQuery.data?.name}</Typography>
            <TicketList tickets={ticketsQuery.data} org={orgQuery.data} />
        </div>
    );
}

interface TicketListProps {
    tickets: TicketModel[] | undefined;
    org: OrganizationModel;
}

const TicketList: FC<TicketListProps> = ({ tickets, org }) => {
    const ticketList = tickets || [];
    const navigate = useNavigate();
    const colDefs: GridColDef[] = [
        { field: 'title', headerName: 'Title', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'priority', headerName: 'Priority', width: 130 },
    ];
    if (!org.oauth_token_email) {
        return (
            <div>
                <Typography variant="h5">No Nylas Account</Typography>
                <Button href="/api/nylas/auth" variant="contained">Link</Button>
            </div>
        )
    }

    const handleRowClick = (row: any) => {
        console.log(row);
        navigate(`/tickets/${row.id}`)
    };


    const refetch = async () => {
        await triggerWorkflow();
    };

    return (
        <div>
            <h1>Tickets for: {org.oauth_token_email}</h1>
            <Button variant="contained" color="primary" onClick={refetch}>
                Refresh
            </Button>
            <DataGrid onRowClick={handleRowClick} rows={ticketList} columns={colDefs} />
        </div>
    );
}

export {
    OrganizationPage,
    TicketList
}