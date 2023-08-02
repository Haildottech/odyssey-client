import React, { useEffect, useReducer } from "react";
import axios from "axios";
import Ledger from "./Ledger";
import moment from "moment";

const initialState = {
  childAccount: [],
  mainAcc: "",
  openingBalance: 0,
  closing: 0,
  records: [],
  visible: false,
  load: false,
  account: "",
  from: "",
  to: moment().format("YYYY-MM-DD"),
  company: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_DATA":
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};

const Index = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { company, from, to, childAccount, visible, account, records, openingBalance, closing } = state;

  let closingBalance = 0;
  let balance = 0;
  const req = async () => {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_CLIMAX_GET_PARENT_ACCOUNTS,
      {
        headers: { id: company },
      }
    );
    let temprecords = [];
    res.data.result.map((x) => {
      return temprecords.push({
        value: x.id,
        label: x.title,
      });
    });
    dispatch({ type: "SET_DATA", payload: { records: temprecords } });
  };

  useEffect(() => {
    req();
  }, [company]);

  const handleSubmit = () => {
    dispatch({ type: "SET_DATA", payload: true });
    const req = async () => {
      await axios.get(process.env.NEXT_PUBLIC_CLIMAX_GET_VOUCEHR_LEDGER_BY_DATE, {
        headers: { id: account, to: to },
      }).then((x) => {
        if (Array.isArray(x?.data?.result)) {
          let arr = x?.data?.result.filter(
            (y) => y?.Voucher_Heads.length > 0
          );
          dispatch({ type: "SET_DATA", payload: { childAccount: arr } });
        }
        dispatch({ type: "SET_DATA", payload: { visible: true } });
      });

      records.filter((x) =>
        account === x.value && dispatch({ type:"SET_DATA", payload:{ mainAcc:x.label } })
      );
    };
    req();

    dispatch({ type: "SET_DATA", payload: { load: false } });
  };

  useEffect(() => {
    if (childAccount.length > 0 && openingBalance == 0) {
      childAccount.forEach((x) => {
        x?.Voucher_Heads?.forEach((y) => {
          if (
            y.Voucher?.vType === "CPV" ||
            y.Voucher?.vType === "BPV" ||
            y.Voucher?.vType === "SI"
          ) {
            closingBalance += parseFloat(y?.amount);
          } else {
            closingBalance -= parseFloat(y?.amount);
          }
        });
      });
    }
    else if (childAccount.length > 0 && openingBalance > 0 || openingBalance < 0) {
      childAccount.forEach((x) => {
        x?.Voucher_Heads?.forEach((y) => {
          if (
            y.Voucher?.vType === "CPV" ||
            y.Voucher?.vType === "BPV" ||
            y.Voucher?.vType === "SI"
          ) {
            closingBalance  = openingBalance + parseFloat(y.amount);
          } else {
            closingBalance  = openingBalance - parseFloat(y.amount);
          }
        });
      });
    }
 
    childAccount.length > 0
    ? dispatch({
        type: "SET_DATA",
        payload: { closing: closingBalance },
      })
    : dispatch({ type: "SET_DATA", payload: { closing: 0 } });
  }, [childAccount]);

  useEffect(() => {
    if (!childAccount || !from) {
      return;
    }

    const filteredData = childAccount.flatMap((x) => {
      let result = {};
      const voucherDate = x?.Voucher_Heads?.filter((y) => {
        return moment(y.createdAt.slice(0, 10), "YYYY-MM-DD").isBetween(
          moment(from, "YYYY-MM-DD"),
          moment(to, "YYYY-MM-DD"),
          null,
          "[]"
        );
      });
      result = { title: x.title, Voucher_Heads: voucherDate };
      return result;
    });

    const data = filteredData?.filter((x) => x.Voucher_Heads.length > 0);
    dispatch({ type: "SET_DATA", payload: { childAccount: data } });

    const findOpening = childAccount.map((x) => {
      const voucherDate = x?.Voucher_Heads?.filter((y) => {
        return moment(y.createdAt.slice(0, 10), "YYYY-MM-DD").isBefore(
          moment(from, "YYYY-MM-DD")
        );
      });

      return voucherDate;
    });
    let balance = 0;
    findOpening.forEach((x) => {
      x.forEach((y) => {
        y.Voucher.vType === "CPV" ||
        y.Voucher.vType === "BPV" ||
        y.Voucher.vType === "SI"
        ? (balance += parseFloat(y.amount))
        : (balance -= parseFloat(y.amount));
      });
    });
    dispatch({ type: "SET_DATA", payload: { openingBalance: balance } });
  }, [visible]);

  const getDebitCredit = (y, type) => {
    let result = "";
    result =
      y.Voucher?.vType == (type == "debit" ? "CPV" : "CRV")
        ? Number(y?.amount)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
        : y.Voucher?.vType == (type == "debit" ? "BPV" : "BRV")
        ? Number(y?.amount)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
        : y.Voucher?.vType == (type == "debit" ? "SI" : "PI")
        ? Number(y?.amount)
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ", ")
        : "";
    return result;
  };

  const getOpeningBalance = openingBalance >= 0? 
  `${Math.abs(openingBalance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")} Dr`
  :`${Math.abs(openingBalance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")} Cr`;
        
  const computedBalance = (y, type) => {
    type === "CPV" ||
    type === "BPV" ||
    type === "SI" ? 
      balance += parseFloat(y?.amount)
    : balance -= parseFloat(y?.amount) 
  
    return balance <0? Math.abs(balance).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")+" Cr" : balance.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")+" Dr"
  }

  return (
    <>
      <Ledger
        state={state}
        dispatch={dispatch}
        handleSubmit={handleSubmit}
        getDebitCredit={getDebitCredit}
        balance={balance}
        getOpeningBalance={getOpeningBalance}
        computedBalance = {computedBalance}
      />
    </>
  );
};

export default Index;
