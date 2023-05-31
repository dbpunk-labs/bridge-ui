import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LoadingButton from '@mui/lab/LoadingButton';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import StarIcon from "@mui/icons-material/StarBorder";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

import {
    FaucetProvider
} from 'db3.js'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Buffer } from 'buffer';
import { useAsyncFn } from 'react-use';
import { useBalance } from 'wagmi';
import { useAccount } from 'wagmi';
globalThis.Buffer = Buffer
const faucet = new FaucetProvider('http://127.0.0.1:26649', window)

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://db3.network/">
      db3.network
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Pricing() {
     const [depositFormState, openDepositForm] = React.useState(false);
    const [isRequestFaucetOk, setRequestFaucetResult] = React.useState(false);
    const [requestFaucetErr, setRequestFaucetErr] = React.useState({
        isErr: false,
        err: ""
    });
    const [faucetLoading, setFaucetLoading] = React.useState(false);
    const [inited, setInited] = React.useState(false)
    const [facuetState, setFaucetState] = React.useState({
        totalAmount: "0",
           totalAddress:"0"
        })
    const  { address, isConnecting, isDisconnected }   = useAccount()
    const  { data, isError, isLoading }  = useBalance({
        address,
        token: "0x7b68E10c80474DD93bD8C1ad53D4463c60a3AB7c"
    })
    const [_state, requestFaucetState] = useAsyncFn(async() => {
        const response = await faucet.getState()
        setFaucetState({
           totalAmount: (BigInt(response.totalAmount) / BigInt(1000000000)).toString() ,
           totalAddress: response.totalAddress
        })
    })

    const [_req, requestFund] = useAsyncFn(async() => {
        try {
            await faucet.connect()
            console.log("req")
            setFaucetLoading(true)
            const [ok, msg] = await faucet.faucet()
            setFaucetLoading(false)
            if (ok) {
                setRequestFaucetResult(true)
            }else {
                setRequestFaucetErr({
                    isErr: true,
                    err:"Please request the fund after 24h"
                })
            }
        }catch(e) {
            setFaucetLoading(false)
            setRequestFaucetErr({
                    isErr: true,
                    err:"Please request the fund after 24h"
            })
        }
    })

    if (!inited) {
        requestFaucetState()
        setInited(true)
        console.log(data)
    }

  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap", bgcolor: "background.paper" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            DB3 Network
          </Typography>
            <ConnectButton
              showBalance={false}
              label="Connect to Wallet"
              accountStatus="address"
            />
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h3"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
        >
          DB3 Network Bridge
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Collapse in={requestFaucetErr.isErr}>
        <Alert severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                  setRequestFaucetErr({
                      isErr:false,
                      err:""
                 })
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ m: 2 }}
        >
         {requestFaucetErr.err}
        </Alert>
        </Collapse>

        <Collapse in={isRequestFaucetOk}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                  setRequestFaucetResult(false)
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ m: 2 }}
        >
         Request 1 DB3 sucessfully
        </Alert>
        </Collapse>

        <Grid container spacing={4} alignItems="flex-end">
          <Grid item xs={6} md={6}>
            <Box
              sx={{
                bgcolor: "#E7E7E7",
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
                minWidth: 100,
                gap: 2,
                margin: 2,
              }}
            >
              <Box sx={{ color: "text.secondary" }}>Total Distributed Fund</Box>
              <Box
                sx={{
                  color: "text.primary",
                  fontSize: 34,
                  fontWeight: "medium",
                }}
              >
                {facuetState.totalAmount} DB3
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} md={6}>
            <Box
              sx={{
                bgcolor: "#E7E7E7",
                boxShadow: 1,
                borderRadius: 1,
                p: 2,
                minWidth: 100,
                gap: 2,
                margin: 2,
              }}
            >
              <Box sx={{ color: "text.secondary" }}>
                Total Distributed Address
              </Box>
              <Box
                sx={{
                  color: "text.primary",
                  fontSize: 34,
                  fontWeight: "medium",
                }}
              >
                {facuetState.totalAddress}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={6} md={6}>
               <LoadingButton 
                loading={faucetLoading}
                loadingIndicator="Loading…"
                onClick={()=> {requestFund() }}
               sx={{mx:2, with:100}} variant="contained" size="large" ><span>Request Faucet</span></LoadingButton>
          </Grid>
          <Grid item xs={6} md={6}>
               <LoadingButton sx={{with:100, mx:2}} variant="contained" size="large" onClick={()=> {openDepositForm(true)}} >Deposit</LoadingButton>
          </Grid>
        </Grid>

       <Dialog open={depositFormState} onClose={() => {openDepositForm(false)}}>
        <DialogTitle>Deposit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deposit your db3 token to db3 network
          </DialogContentText>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
          <Input
            id="standard-adornment-amount"
            startAdornment={<InputAdornment position="start">DB3</InputAdornment>}
          />
        </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {openDepositForm(false)}}>Cancel</Button>
          <Button onClick={() => {openDepositForm(false)}}>Subscribe</Button>
        </DialogActions>
      </Dialog>

        </Container>
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
       <Copyright sx={{ mt: 5 }} />

      </Container>
    </ThemeProvider>
  );
}
