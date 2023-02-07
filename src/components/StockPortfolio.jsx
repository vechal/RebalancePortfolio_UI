import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { getStockPortfolio, postRebalanceStockPortfolio, postStockPortfolio } from "../services";
import "./StockPortfolio.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StockPortfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sharePrice, setSharePrice] = useState({
    AAPL: 0,
    THD: 0,
    CYBR: 0,
    ABB: 0,
  });
  const headers = [
    "Symbol",
    "Desired %",
    "No of shares",
    "Closed Stock value",
    "Asset Value",
    "Current %",
    "Current Value",
    "Current Stock Price",
    "Sell",
    "Buy",
    "No Of Shares To Buy Or Sell",
    "Status"
  ];
  
  useEffect(() => {}, []);

  function getData() {
    setLoading(true);
    getStockPortfolio()
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }

  function onInputChange(e, symbol) {
    if (e.target.value.length <= 6) {
      setSharePrice({
        ...sharePrice,
        [symbol]: parseFloat(e.target.value) || "",
      });
    } else {
      alert(
        "Current Share Price cannot be greater than 999999\n Please Check your entered values"
      );
    }
  }

  function calculate() {
    setLoading(true);
    data.forEach((stock) => {
      console.log("Temp: ", sharePrice[stock.symbol]);
      stock.currentSharePrice = sharePrice[stock.symbol];
    });
    postStockPortfolio(data)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    console.log("Data: ", data);
  }

  function getTotal(title) {
    return data.reduce((acc, value) => acc + value[title], 0);
  }

  function rebalance(){
    data.forEach((stock) => {
      console.log("Temp: ", sharePrice[stock.symbol]);
      stock.currentSharePrice = sharePrice[stock.symbol];
    });
    postRebalanceStockPortfolio(data)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
    console.log("Data: ", data);

  }

  return (
    <div>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" component="h3">
          Stock Portfolio
        </Typography>
        <Button
          style={{ backgroundColor: "darkgreen" }}
          onClick={() => getData()}
          variant="contained"
        >
          Fetch Data
        </Button>
        {data && (
          <TableContainer className="table-container" component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <StyledTableCell
                      className="table-header-cell"
                      variant="head"
                      key={header}
                    >
                      {header}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((obj) => {
                  console.log("Share Price: ",sharePrice[obj.symbol]-obj.closedSharePrice)
                  return (
                    <StyledTableRow
                      key={obj?.symbol}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        className="table-cell-first"
                        component="th"
                        scope="row"
                      >
                        {obj?.symbol}
                      </TableCell>
                      <TableCell align="center">
                        {obj?.desiredPercentage}%
                      </TableCell>
                      <TableCell align="center">
                        {obj?.numberOfShares}
                      </TableCell>
                      <TableCell align="center">
                        {obj?.closedSharePrice}
                      </TableCell>
                      <TableCell align="center">{obj?.assertValue}</TableCell>
                      <TableCell align="center">
                        {obj?.currentPercentage}%
                      </TableCell>
                      <TableCell align="center">
                        {obj?.currentAssertValue}
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          value={sharePrice[obj.symbol]}
                          onChange={(e) => onInputChange(e, obj.symbol)}
                          placeholder={"Enter"}
                          name={obj.symbol}
                          type="number"
                          inputProps={{
                            size: 5,
                            maxLength: 5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        {obj.sell ? (
                          <i
                            style={{ color: "green" }}
                            className="fa-solid fa-circle-check"
                          />
                        ) : <></>}
                      </TableCell>
                      <TableCell align="center">
                        {obj.buy ? (
                          <i
                            style={{ color: "green" }}
                            className="fa-solid fa-circle-check"
                          />
                        ) : <></>}
                      </TableCell>
                      <TableCell align="center">
                        {obj?.noOfSharesToBuyOrSell}
                      </TableCell>
                      <TableCell align="center">
                        {(sharePrice[obj.symbol]-obj.closedSharePrice>0)? (
                          <i
                            style={{ color: "green" }}
                            className="fa-solid fa-arrow-up"
                          />
                        ) : (sharePrice[obj.symbol]-obj.closedSharePrice===0?<></>:(<i style={{ color: "red" }} className="fa-solid fa-arrow-down"></i>))}
                      </TableCell>
                    </StyledTableRow>
                  );
                })}
                <TableRow style={{ fontWeight: "bold" }}>
                  <TableCell style={{ fontWeight: "bold" }}>Total</TableCell>
                  {[
                    "desiredPercentage" ].map((prop) => {
                      return (
                        <TableCell align="center">{getTotal(prop)}</TableCell>
                      );
                    })}
                    <TableCell align="center"> </TableCell>
                  <TableCell align="center"> </TableCell>
                  {[ "assertValue",
                    "currentPercentage",
                    "currentAssertValue",                    
                  ].map((prop) => {
                    return (
                      <TableCell align="center">{getTotal(prop)}</TableCell>
                    );
                  })}
                  <TableCell align="center"> </TableCell>
                  <TableCell align="center"> </TableCell>
                  <TableCell align="center"> </TableCell>
                  <TableCell align="center"> </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {loading ? (
          <Spinner/>
        ) : (
          data && (
            <Button
              onClick={() => calculate()}
              className="btn"
              variant="contained"
            >
              Calculate
            </Button>
          )
        )}
        {!loading&&data&&data.every(sym=>(sym.sell||sym.buy))&&<Button
              onClick={() => rebalance()}
              className="btn-rebalance"
              variant="contained"
            >
              Rebalance
            </Button>}
      </Stack>
    </div>
  );
};

const Spinner = () => {
  return (
    <div className="lds-circle">
      <div></div>
    </div>
  );
};

export default StockPortfolio;
