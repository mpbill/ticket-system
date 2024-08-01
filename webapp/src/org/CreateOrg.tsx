import { Container, Box, Typography, Grid, TextField, Button } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { createOrg } from "../api";
import { useState } from "react";

export default function CreateOrg() {
    const [name, setName] = useState<string>('');
    const mutation = useMutation({ mutationFn: createOrg, onSuccess: (data) => { console.log(data) } });
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        mutation.mutate(name);
    };
    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>
                    Create Organization
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Name"
                                variant="outlined"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? 'Creating...' : 'Create'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Container>
    );
}