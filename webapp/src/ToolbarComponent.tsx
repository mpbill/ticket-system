import Typography from "@mui/material/Typography";
import { AppBar, Button, Toolbar } from "@mui/material";
import { Link } from "react-router-dom";
import React from "react";
import { UserModel } from "./models/user.model";


export interface ToolbarProps {
    user: UserModel | null;
    logout: () => void;
}

const ToolbarComponent: React.FC<ToolbarProps> = ({ user, logout }) => {

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    My Application
                </Typography>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" style={{ marginRight: 10 }}>
                            {user.email}
                        </Typography>
                        <Button onClick={logout} variant="contained" color="secondary">
                            Logout
                        </Button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                            <Button variant="contained" color="secondary">Login</Button>
                        </Link>
                        <Link to="/register" style={{ textDecoration: 'none', color: 'white' }}>
                            <Button variant="contained" color="secondary">Register</Button>
                        </Link>
                    </div>

                )}
            </Toolbar>
        </AppBar>
    );
};

export default ToolbarComponent;