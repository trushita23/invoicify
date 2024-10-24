import { DeleteOutlineRounded } from "@material-ui/icons";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import Button from "@mui/material/Button";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Grid,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  InputBase,
  IconButton,
  Autocomplete,
  TextareaAutosize,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useStyles } from "./style";
import { withStyles } from "@mui/styles";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { currencies } from "../../data/currencyData";
import { useEffect } from "react";
import moment from "moment";
import AddCustomerComp from "../AddCustomer";
import { useHistory } from "react-router-dom";

const invoiceInitial = {
  products: [{ itemName: "", unitPrice: "", quantity: "", discount: "" }],
  total: 0,
  notes: "",
  taxRate: "",
  vat: 0,
  currency: "",
  // invoiceNumber: Math.floor(Math.random() * 100000),
  payment_status: "unpaid",
  type: "Invoice",
  paid_date: null,
  client: {},
};
const TableHeader = withStyles((theme) => ({
  root: {
    backgroundColor: "#f5f5f5",
    color: "white",
  },
}))(TableHead);

const TableHeaderCell = withStyles((theme) => ({
  root: {
    color: "black",
    fontWeight: 600,
  },
}))(TableCell);

const InvoiceComp = (props) => {
  const userInfo = props.userInfo;
  const customerData = props.customerData;
  const [invoiceData, setInvoiceData] = useState(invoiceInitial);
  const [taxRate, setTaxRate] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [subTotal, setSubTotal] = useState([]);
  const [vat, setVat] = useState(0);
  // const [taxRate, setRates] = useState(0);
  const [totalAmt, setTotalAmt] = useState(0);
  const [currency, setCurrency] = useState({});
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [currentCustomer, setCurrentCustomer] = useState({
    name: "Select Customer",
  });

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();

  const handleChange = (index, e) => {
    const values = [...invoiceData.products];
    values[index][e.target.name] = e.target.value;
    setInvoiceData({ ...invoiceData, products: values });
  };

  const handleSubmit = () => {
    const updatedInvoice = {
      ...invoiceData,
      subTotal: subTotal,
      total: totalAmt,
      vat: vat,
      taxRate: taxRate,
      currency: currency,
      creator: `${userInfo.email}`,
      dueDate: moment(selectedDate).format("MM/DD/yyyy"),
      payment_status: paymentStatus,
      client: currentCustomer,
    };
    props.handleSubmit(updatedInvoice);
    alert("Invoice Details Saved Successfully");
    history.push("/invoiceList");
  };

  const handleDelete = (index) => {
    const invoiceValues = invoiceData.products;
    invoiceValues.splice(index, 1);
    setInvoiceData((prevState) => ({ ...prevState, invoiceValues }));
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({
      ...prevState,
      products: [
        ...prevState.products,
        { itemName: "", unitPrice: "", quantity: "", discount: "", amount: "" },
      ],
    }));
  };

  const handleTaxRates = (e) => {
    setTaxRate(e.target.value);
    setInvoiceData((prevState) => ({ ...prevState, taxRate: e.target.value }));
  };

  const handleNotesChange = (e) => {
    e.preventDefault();
    setInvoiceData((prevState) => ({ ...prevState, notes: e.target.value }));
  };

  const calSubTotal = () => {
    let total = 0;
    let itemAmount = document.getElementsByName("amount");
    for (let i = 0; i < itemAmount.length; i++) {
      if (itemAmount[i].value) {
        total += +itemAmount[i].value;
      }
      setSubTotal(total);
    }
  };

  useEffect(() => {
    calSubTotal();
  }, [invoiceData]);

  const calTotalAmount = () => {
    const totalAmount = (taxRate / 100) * subTotal + subTotal;
    setVat((taxRate / 100) * subTotal);
    setTotalAmt(totalAmount);
  };

  useEffect(() => {
    calTotalAmount();
  }, [invoiceData, taxRate, subTotal]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const displayTable = () => {
    return (
      <Box pl={3} pr={3} pt={3}>
        <TableContainer component={Paper} className="tb-container">
          <Table className={classes.table} aria-label="simple table">
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Item</TableHeaderCell>
                <TableHeaderCell>Qty</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Discount (%)</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell scope="row" style={{ width: "40%" }}>
                    {" "}
                    <InputBase
                      style={{ width: "100%" }}
                      outline="none"
                      sx={{ ml: 1, flex: 1 }}
                      type="text"
                      name="itemName"
                      onChange={(e) => handleChange(index, e)}
                      value={item.itemName}
                      placeholder="Item name"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      type="number"
                      name="quantity"
                      onChange={(e) => handleChange(index, e)}
                      value={item.quantity}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      type="number"
                      name="unitPrice"
                      onChange={(e) => handleChange(index, e)}
                      value={item.unitPrice}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      type="number"
                      name="discount"
                      onChange={(e) => handleChange(index, e)}
                      value={item.discount}
                      placeholder="0"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      disabled
                      type="number"
                      name="amount"
                      onChange={(e) => handleChange(index, e)}
                      value={
                        item.quantity * item.unitPrice -
                        (item.quantity * item.unitPrice * item.discount) / 100
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDelete(index)}>
                      <DeleteOutlineRounded
                        style={{ width: "20px", height: "20px" }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          <IconButton onClick={(e) => handleAddRow(e)}>
            <AddCircleRoundedIcon fontSize="large" color="primary" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  const currencyOption = {
    options: currencies,
    getOptionLabel: (option) => option.label,
  };

  const customerName = {
    options: customerData,
    getOptionLabel: (option) => option && option.name,
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const displaySummaryTable = () => {
    return (
      <TableContainer component={Paper} className="tb-container">
        <Table className={classes.table} aria-label="simple table">
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Invoice Summary</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow key={1}>
              <TableCell scope="row" style={{ width: "20%" }}>
                Sub Total:
              </TableCell>
              <TableCell scope="row" style={{ width: "20%" }}>
                {subTotal}
              </TableCell>
            </TableRow>
            <TableRow key={1}>
              <TableCell scope="row" style={{ width: "20%" }}>
                VAT(%):
              </TableCell>
              <TableCell scope="row" style={{ width: "20%" }}>
                {vat}
              </TableCell>
            </TableRow>
            <TableRow key={3}>
              <TableCell scope="row" style={{ width: "20%" }}>
                Total:
              </TableCell>
              <TableCell scope="row" style={{ width: "20%" }}>
                {totalAmt}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box pt={2} pl={3}>
      {/* <AddCustomerComp setOpen={setOpen} open={open} /> */}

      <Paper elevation={1}>
        <Grid container>
          <Grid item xs={12}>
            <Box pt={2}>
              <Typography fontWeight={600} variant="h4" textAlign="center">
                INVOICE
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {/* <Box display="flex" justifyContent="flex-end" pr={3}>
              <Typography> Invoice #</Typography>
              <Typography>001</Typography>
            </Box> */}
          </Grid>
          <Grid item xs={12}>
            <Box pb={2} pl={2} pr={2}>
              <Divider />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box pt={3}>
              <Grid container>
                <Grid item xs={6}>
                  <Box display="flex" flexDirection="column" pl={3}>
                    <Typography> BILL TO</Typography>
                    {customerName && (
                      <Autocomplete
                        sx={{ width: "50%" }}
                        {...customerName}
                        id="debug"
                        debug
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Customer"
                            margin="normal"
                            variant="outlined"
                          />
                        )}
                        value={currentCustomer}
                        onChange={(event, value) => setCurrentCustomer(value)}
                      />
                    )}

                    <Box pt={3}>
                      <Chip
                        avatar={<Avatar>+</Avatar>}
                        label="New Customer"
                        variant="outlined"
                        onClick={handleClickOpen}
                      />
                      {/* <Button variant="outlined">New Customer</Button> */}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box display="flex" flexDirection="column">
                    <Typography>Payment Status</Typography>
                    <Typography color="red">Unpaid</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box display="flex" flexDirection="column">
                    <Box>
                      <Typography>Date</Typography>
                      <Typography>
                        {moment(Date.now()).format("MM/DD/yyyy")}
                      </Typography>
                    </Box>
                    {/* <Box>
                      <Typography>Date</Typography>
                      <Typography>July 17th 2022</Typography>
                    </Box> */}
                    <Typography>Amount</Typography>
                    <Typography>{totalAmt}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box>{displayTable()}</Box>
          </Grid>
          <Grid item xs={6}></Grid>
          <Grid item xs={6}>
            <Box pr={3}>{displaySummaryTable()}</Box>
          </Grid>
          <Grid item xs={3}>
            <Box pl={6} pt={5}>
              <TextField
                type="text"
                step="any"
                name="taxRate"
                id="taxRate"
                value={taxRate}
                onChange={(e) => {
                  handleTaxRates(e);
                }}
                placeholder="e.g 10"
                label="Tax(%)"
                variant="standard"
              />
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box pl={3} pt={5} textAlign="center">
              <TextField
                color="primary"
                sx={{ marginRight: "1rem" }}
                id="date"
                label="Due Date"
                type="date"
                onChange={handleDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Due date"
                  format="MM/dd/yyyy"
                  placeholder="MM/dd/yyyy"
                  defaultValue={moment(Date.now()).format("MM/DD/yyyy")}
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider> */}
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box pl={6} pt={3} pr={5}>
              <Autocomplete
                {...currencyOption}
                id="debug"
                debug
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select currency"
                    margin="normal"
                    variant="outlined"
                  />
                )}
                value={currency.value}
                onChange={(event, value) => setCurrency(value.value)}
              />
            </Box>
          </Grid>
          <Grid item xs={8}></Grid>
          <Grid item xs={12}>
            <Box pl={6} pt={5} pr={6}>
              <Typography fontWeight={600}> Additional Notes</Typography>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={7}
                placeholder=""
                style={{ width: "100%" }}
                onChange={(e) => {
                  handleNotesChange(e);
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" pb={8}>
              <Button
                className={classes.saveButton}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Save Invoice
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <AddCustomerComp
              userInfo={userInfo}
              open={open}
              handleClickOpen={handleClickOpen}
              handleClose={handleClose}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
export default InvoiceComp;
